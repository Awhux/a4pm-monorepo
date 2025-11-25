import { expect, test } from '@playwright/test'

test.describe('User Journey', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/v1/users', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ id: 1, login: 'testuser', name: 'Test User' }),
      })
    })

    await page.route('**/v1/auth/login', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Logged in successfully',
          user: { id: 1, login: 'testuser', name: 'Test User' },
        }),
      })
    })

    await page.route('**/v1/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 1, login: 'testuser', name: 'Test User' }),
      })
    })

    await page.route('**/v1/categories', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 1, name: 'Sobremesa', slug: 'sobremesa' },
          { id: 2, name: 'Prato Principal', slug: 'prato-principal' },
        ]),
      })
    })

    await page.route('**/v1/recipes', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 100,
            name: 'My Test Recipe',
            categoryId: 1,
            userId: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }),
        })
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              id: 100,
              name: 'My Test Recipe',
              preparationTime: 30,
              servings: 4,
              categoryId: 1,
              userId: 1,
              category: { name: 'Sobremesa' },
              user: { name: 'Test User' },
            },
          ]),
        })
      }
    })
  })

  test('visitor can register, login and create a recipe', async ({ page }) => {
    await page.goto('/register')
    await page.fill('input#name', 'Test User')
    await page.fill('input#login', 'testuser')
    await page.fill('input#password', 'password123')
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL('/')
    await expect(page.locator('h2')).toContainText('Receitas')

    await page.click('text=Nova Receita')
    await expect(page).toHaveURL('/recipes/create')

    await page.fill('input#name', 'My Test Recipe')

    await page.waitForSelector('select#category option')
    await page.selectOption('select#category', '1')

    await page.fill('input#preparationTime', '30')
    await page.fill('input#servings', '4')
    await page.fill('textarea#ingredients', 'Ingredient 1\nIngredient 2')
    await page.fill('textarea#preparationMethod', 'Step 1\nStep 2')

    await page.click('button:has-text("Salvar Receita")')

    await expect(page).toHaveURL('/')

    await expect(page.locator('text=My Test Recipe')).toBeVisible()
    await expect(page.locator('text=Sobremesa')).toBeVisible()
    await expect(page.locator('text=30 min')).toBeVisible()
  })
})
