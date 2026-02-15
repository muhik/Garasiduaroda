export const runtime = 'edge';
import { createClient } from '@libsql/client/web';

export async function GET() {
    try {
        const url = process.env.TURSO_DATABASE_URL;
        const authToken = process.env.TURSO_AUTH_TOKEN;

        if (!url || !authToken) {
            throw new Error('Missing environment variables');
        }

        // Force HTTPS for the web client to ensure it uses the HTTP driver
        const httpUrl = url.replace('libsql://', 'https://');

        const client = createClient({
            url: httpUrl,
            authToken,
        });

        const rs = await client.execute('SELECT 1 as val');
        return new Response(JSON.stringify({
            status: 'Success',
            data: rs,
            provider: 'ISOLATED @libsql/client/web'
        }, null, 2), {
            headers: { 'content-type': 'application/json' }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({
            status: 'Error',
            message: error.message,
            stack: error.stack,
            provider: 'ISOLATED @libsql/client/web'
        }, null, 2), {
            status: 500,
            headers: { 'content-type': 'application/json' }
        });
    }
}
