export const runtime = 'edge';
import { client } from '@/lib/db';

export async function GET() {
    try {
        const rs = await client.execute('SELECT 1 as val');
        return new Response(JSON.stringify({
            status: 'Success',
            data: rs,
            provider: 'Pure LibSQL Client'
        }, null, 2), {
            headers: { 'content-type': 'application/json' }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({
            status: 'Error',
            message: error.message,
            stack: error.stack,
            provider: 'Pure LibSQL Client'
        }, null, 2), {
            status: 500,
            headers: { 'content-type': 'application/json' }
        });
    }
}
