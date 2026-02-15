import { drizzle } from 'drizzle-orm/sqlite-proxy';

// Use sqlite-proxy to avoid ANY dependency on @libsql/client
// This bypasses the XMLHttpRequest error completely by using native fetch
export const db = drizzle(async (sql, params, method) => {
    const url = (process.env.TURSO_DATABASE_URL || '').replace('libsql://', 'https://');
    const authToken = process.env.TURSO_AUTH_TOKEN || '';

    // Construct statements for Turso HTTP API v2 pipeline
    const pipelineReq = {
        requests: [
            {
                type: "execute",
                stmt: {
                    sql: sql,
                    args: params
                }
            },
            { type: "close" }
        ]
    };

    const response = await fetch(`${url}/v2/pipeline`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pipelineReq)
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Turso HTTP Error ${response.status}: ${text}`);
    }

    const data = await response.json();
    const resultItem = data.results[0]; // First request result

    if (resultItem.type === 'error') {
        throw new Error(resultItem.error.message);
    }

    const rs = resultItem.response.result;

    // Convert Turso v2 response to what sqlite-proxy expects (array of arrays for rows)
    // Turso returns: { cols: [{name}, ...], rows: [[{type, value}, ...], ...] }
    // sqlite-proxy needs simple values in rows
    const rows = rs.rows.map((r: any) => r.map((c: any) => c.value));

    return { rows: rows };
});

// Export a dummy client object to satisfy any lingering imports, 
// but warn that it's not a real LibSQL client
export const client = {
    execute: () => { throw new Error("Do not use 'client' directly. Use 'db' instead."); }
} as any;
