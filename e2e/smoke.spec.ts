import { expect, Locator, Page, test } from '@playwright/test'

// Typing or clicking before React attaches to the page would be lost
async function waitForHydration(element: Locator) {
  await expect
    .poll(() => element.evaluate(node => Object.keys(node).some(key => key.startsWith('__reactProps'))))
    .toBe(true)
}

async function signUp(page: Page, email: string, password: string) {
  await page.goto('/auth/signup')
  await waitForHydration(page.locator('#name'))
  await page.fill('#name', 'Smoke Tester')
  await page.fill('#signup-email', email)
  await page.fill('#password', password)
  await page.fill('#confirm-password', password)
  await page.check('#terms')
  await page.getByRole('button', { name: 'Create Account' }).click()
  await expect(page).toHaveURL('/')
}

test('a user can change their password', async ({ page }) => {
  const email = `password-${Date.now()}@test.dev`
  const oldPassword = 'correct-horse-battery'
  const newPassword = 'a-brand-new-passphrase'
  await signUp(page, email, oldPassword)

  await page.goto('/account/profile')
  const securityTab = page.getByRole('tab', { name: 'Security' })
  await waitForHydration(securityTab)
  await securityTab.click()
  const changePassword = page.getByRole('button', { name: 'Change Password', exact: true })
  await expect(changePassword).toBeVisible()
  await expect(page.getByText('Two-Factor Authentication')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Sign out other devices' })).toHaveCount(0)
  await changePassword.click()

  await page.fill('#current-pass', 'wrong-password')
  await page.fill('#new-pass', newPassword)
  await page.fill('#confirm-pass', newPassword)
  await page.getByRole('button', { name: 'Update Password' }).click()
  await expect(page.getByText('Your current password is incorrect')).toBeVisible()

  await page.fill('#current-pass', oldPassword)
  await page.getByRole('button', { name: 'Update Password' }).click()
  await expect(page.getByText('Password Changed').first()).toBeVisible()

  expect(await page.evaluate(() => JSON.stringify(localStorage))).not.toContain(newPassword)

  const logIn = (password: string) => page.request.post('/api/auth/login', { data: { email, password } })
  expect((await logIn(newPassword)).status()).toBe(200)
  expect((await logIn(oldPassword)).status()).toBe(401)
})

test('plain-text passwords left by the old version are cleared', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.setItem('pianow_user_password_old@test.dev', 'old-plain-text'))

  await page.reload()

  await expect
    .poll(() => page.evaluate(() => localStorage.getItem('pianow_user_password_old@test.dev')))
    .toBeNull()
})

test('a new visitor can sign up, add a product and reach checkout', async ({ page }) => {
  const pageErrors: string[] = []
  page.on('pageerror', error => pageErrors.push(error.message))

  await signUp(page, `smoke-${Date.now()}@test.dev`, 'correct-horse-battery')

  await page.goto('/shop/product/2')
  const addToCart = page.getByRole('button', { name: 'Add to Cart' })
  await waitForHydration(addToCart)
  await addToCart.click()

  await page.goto('/cart')
  await expect(page.getByRole('heading', { name: 'Yamaha P-45 Digital Piano' })).toBeVisible()

  await page.getByRole('button', { name: 'Proceed to Checkout' }).click()
  await expect(page).toHaveURL('/checkout')
  await expect(page.getByRole('heading', { name: 'Checkout', exact: true })).toBeVisible()
  await expect(page.getByText('Yamaha P-45 Digital Piano')).toBeVisible()
  await expect(page.getByText('Online payments are coming soon')).toBeVisible()
  await expect(page.locator('main input')).toHaveCount(0)

  await page.goto('/account/profile')
  await expect(page.getByRole('tab', { name: 'Security' })).toBeVisible()
  await expect(page.getByText('Payment Methods')).toHaveCount(0)

  expect(pageErrors).toEqual([])
})

test('the lesson payment page asks for no payment details', async ({ page }) => {
  await page.goto('/lessons/payment')

  await expect(page.getByText('Online payments are coming soon')).toBeVisible()
  await expect(page.locator('main input')).toHaveCount(0)
})

for (const path of ['/checkout/success', '/lessons/payment/success']) {
  test(`${path} no longer announces a payment`, async ({ page }) => {
    const response = await page.goto(path)

    expect(response?.status()).toBe(404)
  })
}

test('checkout sends signed-out visitors to the login page', async ({ page }) => {
  await page.goto('/checkout')

  await expect(page).toHaveURL(/\/auth\/login\?redirect=/)
})
