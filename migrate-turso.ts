import { migrate } from 'drizzle-orm/libsql/migrator';
import { db } from './lib/db';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
    console.log('Running migrations on Turso...');
    try {
        await migrate(db, { migrationsFolder: 'drizzle' });
        console.log('Migrations complete!');
    } catch (e) {
        console.error('Migration failed:', e);
        process.exit(1);
    }
}

main();
