export const runtime = 'edge';
import { db } from '@/lib/db';
import { settings } from '@/lib/schema';
import { sql } from 'drizzle-orm';

export async function GET() {
    try {
        // Test 1: Simple SELECT 1
        const start = Date.now();
        // In Drizzle/LibSQL, we can't easily do raw SQL without SQL output, 
        // but let's try querying the settings table which should exist.
        const result = await db.select().from(settings).limit(1);
        const duration = Date.now() - start;

        return new Response(JSON.stringify({
            status: 'Success',
            duration: `${duration}ms`,
            data: result,
            message: 'Database connection is working!'
        }, null, 2), {
            headers: { 'content-type': 'application/json' }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({
            status: 'Error',
            message: error.message,
            stack: error.stack,
            hint: 'Check if table exists and connection is valid'
        }, null, 2), {
            status: 500,
            headers: { 'content-type': 'application/json' }
        });
    }
}
