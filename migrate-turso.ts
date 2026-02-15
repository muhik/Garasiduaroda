import { migrate } from 'drizzle-orm/libsql/migrator';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!url || !authToken) {
        console.error('Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN');
        process.exit(1);
    }

    // Create a standalone client for migrations (runs in Node.js)
    const client = createClient({
        url,
        authToken,
    });

    const db = drizzle(client);

    console.log('Running migrations on Turso...');
    try {
        await migrate(db, { migrationsFolder: 'drizzle' });
        console.log('Migrations complete!');
    } catch (e) {
        console.error('Migration failed:', e);
        process.exit(1);
    } finally {
        client.close();
    }
}

main();
