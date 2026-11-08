import { expect, Locator, test } from '@playwright/test'

// Typing or clicking before React attaches to the page would be lost
async function waitForHydration(element: Locator) {
  await expect
    .poll(() => element.evaluate(node => Object.keys(node).some(key => key.startsWith('__reactProps'))))
    .toBe(true)
}

test('a new visitor can sign up, add a product and reach checkout', async ({ page }) => {
  const pageErrors: string[] = []
  page.on('pageerror', error => pageErrors.push(error.message))

  await page.goto('/auth/signup')
  await waitForHydration(page.locator('#name'))
  await page.fill('#name', 'Smoke Tester')
  await page.fill('#signup-email', `smoke-${Date.now()}@test.dev`)
  await page.fill('#password', 'correct-horse-battery')
  await page.fill('#confirm-password', 'correct-horse-battery')
  await page.check('#terms')
  await page.getByRole('button', { name: 'Create Account' }).click()
  await expect(page).toHaveURL('/')

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
