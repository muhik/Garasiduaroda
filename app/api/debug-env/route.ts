export const runtime = 'edge';

export async function GET() {
    return new Response(JSON.stringify({
        env: {
            hasFetch: typeof fetch !== 'undefined',
            hasXMLHttpRequest: typeof XMLHttpRequest !== 'undefined',
            hasSelf: typeof self !== 'undefined',
            hasWindow: typeof window !== 'undefined',
            nodeEnv: process.env.NODE_ENV,
            nextRuntime: process.env.NEXT_RUNTIME,
        },
        // Safe lookup of important vars
        vars: {
            hasDbUrl: !!process.env.TURSO_DATABASE_URL,
            hasAuthToken: !!process.env.TURSO_AUTH_TOKEN,
        }
    }, null, 2), {
        headers: { 'content-type': 'application/json' }
    });
}
