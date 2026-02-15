export const runtime = 'edge';

export async function GET() {
    return new Response(JSON.stringify({
        url: process.env.TURSO_DATABASE_URL ? 'Set' : 'Not Set',
        token: process.env.TURSO_AUTH_TOKEN ? 'Set' : 'Not Set',
        storeName: process.env.NEXT_PUBLIC_STORE_NAME,
        nodeEnv: process.env.NODE_ENV,
    }, null, 2), {
        headers: { 'content-type': 'application/json' }
    });
}
