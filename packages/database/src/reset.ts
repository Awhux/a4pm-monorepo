#! /usr/bin/env tsx

import fs from 'node:fs'
import path from 'node:path'
import { logger } from './utils/logger'

const SEED_LOCK_FILE = path.resolve(__dirname, '../.seed-lock')

if (!fs.existsSync(SEED_LOCK_FILE)) {
  process.exit(0)
}

fs.unlinkSync(SEED_LOCK_FILE)

logger.info('Database reset complete. Seed lock file removed.')
logger.info('You can now run the seeding process again.')
