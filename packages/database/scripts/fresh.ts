import { existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { logger } from '../src/utils/logger';

async function removeOldGenerated() {
  const generatedDir = join(__dirname, '../src/generated');
  if (existsSync(generatedDir)) {
    rmSync(generatedDir, { recursive: true });
  }
}

removeOldGenerated().catch((error) => {
  logger.error('Failed to remove old generated prisma schema:');
  logger.error(error);
  process.exit(1);
});
