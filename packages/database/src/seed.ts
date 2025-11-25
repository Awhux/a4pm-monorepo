/**
 * Database seed script for Primeflow
 *
 * This script orchestrates the seeding of essential data into the database
 * by calling individual seed modules for different data types.
 *
 * Run with: pnpm db:seed
 * For production or when already seeded: pnpm db:seed --force
 */

import fs from 'node:fs'
import path from 'node:path'
import { PrismaClient } from '@prisma/client'
import { logger } from './utils/logger'

// Configuration
const SEED_LOCK_FILE = path.resolve(__dirname, '../.seed-lock')
const FORCE_FLAG = process.argv.includes('--force')

/**
 * Check if the environment appears to be production
 */
function isProductionEnvironment(): boolean {
  // Check for common production environment indicators
  return (
    process.env.NODE_ENV === 'production' ||
    process.env.ENV === 'production' ||
    process.env.ENVIRONMENT === 'production' ||
    process.env.APP_ENV === 'production' ||
    !!process.env.DATABASE_URL?.includes('prod') ||
    process.env.IS_PRODUCTION === 'true'
  )
}

/**
 * Check if database has already been seeded
 */
function alreadySeeded(): boolean {
  return fs.existsSync(SEED_LOCK_FILE)
}

/**
 * Create the lock file to indicate seeding has completed
 */
function createLockFile(): void {
  try {
    // Create the lock file with timestamp
    fs.writeFileSync(
      SEED_LOCK_FILE,
      JSON.stringify(
        {
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV || 'development',
        },
        null,
        2,
      ),
    )
    logger.info(`Created seed lock file at ${SEED_LOCK_FILE}`)
  } catch (error) {
    logger.warn(
      `Could not create seed lock file: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

const prisma = new PrismaClient()

async function main() {
  // Check for production environment
  if (isProductionEnvironment() && !FORCE_FLAG) {
    logger.error(`
============================== WARNING ==============================
Attempting to seed a production environment!
This operation can potentially modify existing data.

If you really want to seed production data, run with --force flag:
$ pnpm db:seed --force
====================================================================
`)
    process.exit(1)
  }

  // Check if already seeded
  if (alreadySeeded() && !FORCE_FLAG) {
    logger.error(`
============================== WARNING ==============================
Database appears to be already seeded!
A seed lock file exists at:
${SEED_LOCK_FILE}

If you want to reseed, either:
1. Delete the lock file above, or
2. Run with the --force flag:
   $ pnpm db:seed --force
====================================================================
`)
    process.exit(1)
  }

  // If we get here, we can proceed with seeding
  if (FORCE_FLAG) {
    logger.warn(
      'Running with --force flag. Proceeding with database seed regardless of environment or lock file.',
    )
  }

  logger.info('Starting database seed process...')

  try {
    await seedCategories(prisma)

    // Create the lock file to prevent accidental reseeding
    createLockFile()

    logger.info('Database seed completed successfully!')
  } catch (error) {
    logger.error(
      `Error during database seed: ${error instanceof Error ? error.message : String(error)}`,
    )
    throw error
  }
}

async function seedCategories(prisma: PrismaClient) {
  const categories = [
    { id: 1, name: 'Bolos e tortas doces' },
    { id: 2, name: 'Carnes' },
    { id: 3, name: 'Aves' },
    { id: 4, name: 'Peixes e frutos do mar' },
    { id: 5, name: 'Saladas, molhos e acompanhamentos' },
    { id: 6, name: 'Sopas' },
    { id: 7, name: 'Massas' },
    { id: 8, name: 'Bebidas' },
    { id: 9, name: 'Doces e sobremesas' },
    { id: 10, name: 'Lanches' },
    { id: 11, name: 'Prato Único' },
    { id: 12, name: 'Light' },
    { id: 13, name: 'Alimentação Saudável' },
  ]

  logger.info(`Seeding ${categories.length} categories...`)

  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: { name: category.name },
      create: { id: category.id, name: category.name },
    })
  }

  logger.info('Categories seeded successfully.')
}

// Run the seed function
main()
  .catch((e) => {
    logger.error(`Seed process failed: ${e.message}`)
    process.exit(1)
  })
  .finally(async () => {
    // Close the Prisma client connection
    await prisma.$disconnect()
  })
