export const runtime = 'edge';

export async function GET() {
    try {
        const dbUrl = process.env.TURSO_DATABASE_URL;
        const authToken = process.env.TURSO_AUTH_TOKEN;

        if (!dbUrl || !authToken) {
            return new Response(JSON.stringify({ error: 'Missing env vars' }), { status: 500 });
        }

        const httpUrl = dbUrl.replace('libsql://', 'https://');
        const endpoint = `${httpUrl}/v2/pipeline`;

        console.log(`Attempting fetch to ${endpoint}`);

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

        const responseText = await response.text();
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            data = responseText;
        }

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
