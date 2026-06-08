import { readFileSync } from 'fs';
import { join } from 'path';
import { db } from './client';

async function migrate() {
  const migrations = [
    join(__dirname, '../../migrations/001_initial.sql'),
    join(__dirname, '../../migrations/002_tournaments.sql'),
  ];

  for (const file of migrations) {
    console.log(`Running migration: ${file}`);
    try {
      const sql = readFileSync(file, 'utf-8');
      await db.query(sql);
      console.log(`✓ Done`);
    } catch (err) {
      console.error(`✗ Failed:`, err);
      process.exit(1);
    }
  }

  await db.end();
  console.log('All migrations complete.');
}

migrate();
