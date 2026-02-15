import { drizzle } from 'drizzle-orm/sqlite-proxy';

// Use sqlite-proxy to avoid ANY dependency on @libsql/client
// This bypasses the XMLHttpRequest error completely by using native fetch
export const db = drizzle(async (sql, params, method) => {
    const url = (process.env.TURSO_DATABASE_URL || '').replace('libsql://', 'https://');
    const authToken = process.env.TURSO_AUTH_TOKEN || '';

    // Use standard Turso HTTP API (v1) which is simpler and accepts raw values
    // Endpoint: POST /
    // Body: { "statements": [ { "q": "sql", "params": [...] } ] }

    const requestBody = {
        statements: [
            {
                q: sql,
                params: params
            }
        ]
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Turso HTTP V1 Error ${response.status}: ${text}`);
    }

    // V1 Response format: [{ "results": { "columns": [], "rows": [] } }]
    // Or sometimes strict array of results.
    const data = await response.json();

    // Check for error in the first statement result
    if (Array.isArray(data) && data[0]?.error) {
        throw new Error(data[0].error.message);
    }

    // Success response handling
    // Standard response: [ { results: { columns, rows } } ]
    const resultItem = Array.isArray(data) ? data[0] : data;

    // Handle case where resultItem isn't what we expect (safety check)
    if (!resultItem || !resultItem.results) {
        // Should not happen for successful query, but handle just in case
        return { rows: [] };
    }

    // Safely extract rows, defaulting to empty array if undefined (common in mutations)
    const rows = resultItem.results.rows || [];

    // sqlite-proxy expects simple array of arrays for rows, which V1 provides!
    return { rows: rows };
});

// Export a dummy client object to satisfy any lingering imports
export const client = {
    execute: () => { throw new Error("Do not use 'client' directly. Use 'db' instead."); }
} as any;
