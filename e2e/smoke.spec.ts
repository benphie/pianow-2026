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

async function openProfileEditor(page: Page) {
  await page.goto('/account/profile')
  const edit = page.getByRole('button', { name: 'Edit Info' })
  await waitForHydration(edit)
  await expect(edit).toBeEnabled()
  await edit.click()
}

test('a new member sees no invented lessons or notification switches', async ({ page }) => {
  await signUp(page, `new-member-${Date.now()}@test.dev`, 'correct-horse-battery')
  await page.goto('/account/profile')

  const lessonsTab = page.getByRole('tab', { name: 'Lessons' })
  await waitForHydration(lessonsTab)
  await lessonsTab.click()
  await expect(page.getByText('You have no lessons yet.')).toBeVisible()
  await expect(page.getByText('Instructor David')).toHaveCount(0)
  await expect(page.getByRole('link', { name: 'Browse All Lessons' })).toBeVisible()

  await page.getByRole('tab', { name: 'Settings' }).click()
  await expect(page.getByRole('tabpanel', { name: 'Settings' }).getByText('Account Security')).toBeVisible()
  await expect(page.getByRole('switch')).toHaveCount(0)
})

test('the profile shows the month the member really joined', async ({ page }) => {
  await signUp(page, `joined-${Date.now()}@test.dev`, 'correct-horse-battery')
  const thisMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })

  await page.goto('/account/profile')

  await expect(page.getByText(`Member since ${thisMonth}`)).toBeVisible()
})

test('profile details follow the account to another browser', async ({ page, browser }) => {
  const email = `profile-${Date.now()}@test.dev`
  const password = 'correct-horse-battery'
  await signUp(page, email, password)

  await openProfileEditor(page)
  await expect(page.locator('#email')).toBeDisabled()
  await page.fill('#name', 'Renamed Pianist')
  await page.fill('#phone', '+234 800 000 0000')
  await page.fill('#bio', 'Learning jazz piano.')
  await page.getByRole('button', { name: 'Save Changes' }).click()
  await expect(page.getByText('Profile Updated').first()).toBeVisible()

  const otherBrowser = await browser.newContext()
  const otherPage = await otherBrowser.newPage()
  await otherPage.goto('/auth/login')
  await waitForHydration(otherPage.locator('#email'))
  await otherPage.fill('#email', email)
  await otherPage.fill('#password', password)
  await otherPage.locator('button[type="submit"]').click()
  await expect(otherPage).toHaveURL('/')

  await otherPage.goto('/account/profile')
  await expect(otherPage.getByText('Renamed Pianist').first()).toBeVisible()
  await expect(otherPage.getByText('+234 800 000 0000')).toBeVisible()
  await expect(otherPage.getByText('Learning jazz piano.')).toBeVisible()
  await otherBrowser.close()
})

test('details an older version saved only in this browser are kept and uploaded', async ({ page }) => {
  await signUp(page, `old-profile-${Date.now()}@test.dev`, 'correct-horse-battery')
  const storageKey = await page.evaluate(() => {
    const key = `pianow_profile_${JSON.parse(localStorage.getItem('pianow_user')!).id}`
    localStorage.setItem(key, JSON.stringify({ phone: '+234 700 000 0000' }))
    return key
  })

  await openProfileEditor(page)
  await expect(page.locator('#phone')).toHaveValue('+234 700 000 0000')
  await page.getByRole('button', { name: 'Save Changes' }).click()
  await expect(page.getByText('Profile Updated').first()).toBeVisible()

  const token = await page.evaluate(() => localStorage.getItem('pianow_token'))
  const response = await page.request.get('/api/auth/profile', { headers: { Authorization: `Bearer ${token}` } })
  expect((await response.json()).profile.phone).toBe('+234 700 000 0000')
  expect(await page.evaluate(key => localStorage.getItem(key), storageKey)).not.toContain('+234 700 000 0000')
})

test('a background login refresh does not wipe a profile being edited', async ({ page }) => {
  await signUp(page, `refresh-${Date.now()}@test.dev`, 'correct-horse-battery')

  await openProfileEditor(page)
  await page.fill('#bio', 'Still typing')
  await page.evaluate(() => window.dispatchEvent(new Event('pianow_auth_change')))
  await page.waitForTimeout(500)

  await expect(page.locator('#bio')).toHaveValue('Still typing')
})

test('a failed profile save says so and keeps what was typed', async ({ page }) => {
  await signUp(page, `save-failure-${Date.now()}@test.dev`, 'correct-horse-battery')
  await page.route('**/api/auth/profile', route =>
    route.request().method() === 'PUT'
      ? route.fulfill({ status: 500, json: { error: 'Your profile could not be saved. Please try again.' } })
      : route.continue()
  )

  await openProfileEditor(page)
  await page.fill('#bio', 'Typed before the failure')
  await page.getByRole('button', { name: 'Save Changes' }).click()

  await expect(page.getByText('Your profile could not be saved').first()).toBeVisible()
  await expect(page.getByText('Profile Updated')).toHaveCount(0)
  await expect(page.locator('#bio')).toHaveValue('Typed before the failure')
})

test('a profile that fails to load cannot be saved over', async ({ page }) => {
  await signUp(page, `load-failure-${Date.now()}@test.dev`, 'correct-horse-battery')
  await page.route('**/api/auth/profile', route =>
    route.fulfill({ status: 500, json: { error: 'Your profile could not be loaded. Please try again.' } })
  )

  await page.goto('/account/profile')

  await expect(page.getByText('We could not load your details')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Edit Info' })).toBeDisabled()
})

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
