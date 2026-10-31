import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const pages = [
  '/',
  '/hair-care',
  '/skin-care',
  '/supplements',
  '/hair-care/forte',
  '/hair-care?need=volume',
  '/hair-care/forte/forte-serum',
  '/hair-care/black-garlic/black-garlic-shampoo',
  '/skin-care/hydra/hydra-toner',
  '/skin-care/sun-care',
  '/about',
  '/contact',
  '/privacy',
  '/cookies',
  '/terms',
]

for (const path of pages) {
  test(`${path} loads, has one h1, no horizontal overflow and no serious accessibility issues`, async ({ page }) => {
    const res = await page.goto(path)
    expect(res?.status()).toBe(200)
    await expect(page.locator('h1')).toHaveCount(1)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(overflow).toBeLessThanOrEqual(0)
    // axe-core/playwright is typed against an older Playwright; the page object is compatible at runtime.
    const results = await new AxeBuilder({ page: page as unknown as ConstructorParameters<typeof AxeBuilder>[0]['page'] }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()
    const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
    expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([])
  })
}

test('unknown pages return 404', async ({ page }) => {
  const res = await page.goto('/hair-care/not-a-family')
  expect(res?.status()).toBe(404)
})

test('Buy now appears only for products the shop sells, without naming the shop', async ({ page }) => {
  await page.goto('/hair-care/forte/forte-serum')
  const buy = page.getByRole('link', { name: /Buy now/ })
  await expect(buy).toHaveCount(1)
  await expect(buy).toHaveAttribute('href', /^https:\/\/eloriabeauty\.co\.ke\/products\/bioxcin-forte-serum-50-ml\?utm_source=bioxcin\.co\.ke/)
  await expect(buy).not.toContainText(/eloria/i)

  await page.goto('/hair-care/black-garlic/black-garlic-shampoo')
  await expect(page.getByRole('link', { name: /Buy now/ })).toHaveCount(0)
})

test('product pages offer a pre-filled WhatsApp enquiry', async ({ page }) => {
  await page.goto('/hair-care/black-garlic/black-garlic-shampoo')
  const wa = page.getByRole('link', { name: /Enquire on WhatsApp/ })
  await expect(wa).toHaveCount(1)
  const href = await wa.getAttribute('href')
  expect(href).toMatch(/^https:\/\/wa\.me\/254793200000\?text=/)
  expect(decodeURIComponent(href!.split('text=')[1])).toBe('Hi Eloria Beauty, I would like to inquire about Bioxcin Black Garlic Shampoo')
})

test('product tabs switch with the keyboard', async ({ page }, info) => {
  test.skip(info.project.name === 'mobile-360', 'phones show an accordion instead')
  await page.goto('/hair-care/collagen-biotin/collagen-biotin-shampoo')
  const first = page.getByRole('tab', { name: 'Active ingredients' })
  await first.click()
  await page.keyboard.press('ArrowRight')
  await expect(page.getByRole('tab', { name: 'How to use' })).toHaveAttribute('aria-selected', 'true')
  await page.keyboard.press('ArrowRight')
  await expect(page.getByRole('tabpanel')).toContainText('98% volume')
})

test('category filters narrow the product list', async ({ page }) => {
  await page.goto('/skin-care?need=sun-protection')
  await expect(page.getByRole('heading', { level: 2, name: 'Sun protection' })).toBeVisible()
  const cards = page.locator('#products article')
  expect(await cards.count()).toBeGreaterThan(0)
  for (const name of await cards.locator('h3').allTextContents()) expect(name).toMatch(/Sun/)
})

test('navigation menu works with the keyboard', async ({ page }, info) => {
  await page.goto('/')
  if (info.project.name === 'desktop-1440') {
    const trigger = page.getByRole('button', { name: 'Hair care' })
    await trigger.click()
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(page.getByRole('link', { name: /Forte/ }).first()).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(trigger).toBeFocused()
  } else {
    const menu = page.getByRole('button', { name: 'Menu' })
    await menu.click()
    await expect(page.getByRole('button', { name: 'Close' })).toHaveAttribute('aria-expanded', 'true')
    await page.locator('summary', { hasText: 'Skin care' }).click()
    await expect(page.getByRole('link', { name: 'Hydra' }).last()).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('button', { name: 'Menu' })).toBeFocused()
  }
})

test('contact form shows accessible errors, then accepts a valid submission', async ({ page }) => {
  await page.goto('/contact')
  await page.waitForTimeout(2800) // the form rejects submissions faster than a person could type
  await page.getByRole('button', { name: 'Send message' }).click()
  await expect(page.getByRole('alert').filter({ hasText: 'Please check the highlighted fields' })).toBeVisible()
  await expect(page.getByLabel('Your name')).toHaveAttribute('aria-invalid', 'true')

  await page.getByLabel('Your name').fill('Jane Test')
  await page.getByLabel('Phone number').fill('0712 345 678')
  await page.getByLabel('Email address').fill('jane@example.com')
  await page.getByLabel('What is it about?').selectOption('Product advice')
  await page.getByRole('textbox', { name: 'Message' }).fill('Which shampoo suits fine hair?')
  await page.getByRole('checkbox').check()
  await page.getByRole('button', { name: 'Send message' }).click()
  await expect(page.getByRole('status').filter({ hasText: 'received your message' })).toBeVisible()
})

test('business enquiry pages are gone', async ({ request }) => {
  const res = await request.get('/partners/pharmacies', { maxRedirects: 0 })
  expect(res.status()).toBe(308)
  expect(res.headers()['location']).toBe('/contact')
})

test('health check responds', async ({ request }) => {
  const res = await request.get('/healthz')
  expect(res.status()).toBe(200)
})
