import { test, describe, expect, beforeEach } from '@playwright/test'

describe('Blogs', () => {
  test('front page can be opened', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Clean code is required Uncle Bob')).toBeVisible()
  })

  test('blog expanded view displays correctly', async ({ page }) => {
    await page.goto('/')
    const link = page.getByRole('link', { name: 'Clean code is required Uncle Bob' })
    await link.click()

    await expect(page.getByText('Clean code is required')).toBeVisible()
    await expect(page.getByText('By Uncle Bob')).toBeVisible()
    await expect(page.getByText('http://objectorientedprogamming.com')).toBeVisible()
    await expect(page.getByText('Added by Matti Luukkainen')).toBeVisible()
    await expect(page.getByText('8 likes')).toBeVisible()
  })
})