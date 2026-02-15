export const runtime = 'edge';

export async function GET() {
    try {
        const dbUrl = process.env.TURSO_DATABASE_URL;
        const authToken = process.env.TURSO_AUTH_TOKEN;

        if (!dbUrl || !authToken) {
            return new Response(JSON.stringify({ error: 'Missing env vars' }), { status: 500 });
        }

        // Convert libsql:// to https:// for HTTP API
        const httpUrl = dbUrl.replace('libsql://', 'https://');

        // Turso/LibSQL HTTP API endpoint for executing statements
        // POST /v2/pipeline (or /v1/execute used by older clients, checking standard)
        // Using standard execute endpoint pattern for LibSQL HTTP
        const endpoint = `${httpUrl}/v2/pipeline`;

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                requests: [
                    { type: "execute", stmt: { sql: "SELECT 1 as val" } },
                    { type: "close" }
                ]
            })
        });

        const data = await response.json();

        return new Response(JSON.stringify({
            status: 'Success',
            urlUsed: httpUrl,
            data: data,
            provider: 'Raw Fetch'
        }, null, 2), {
            headers: { 'content-type': 'application/json' }
        });

    } catch (error: any) {
        return new Response(JSON.stringify({
            status: 'Error',
            message: error.message,
            stack: error.stack,
            provider: 'Raw Fetch'
        }, null, 2), {
            status: 500,
            headers: { 'content-type': 'application/json' }
        });
    }
}
