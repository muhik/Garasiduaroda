const Database = require('better-sqlite3');
const db = new Database('sqlite.db', { verbose: console.log });

console.log('--- Updating Store Name ---');
const updates = [
    { key: 'storeName', value: 'Garasi Roda Dua' }
];

const stmt = db.prepare('INSERT INTO settings (key, value) VALUES (@key, @value) ON CONFLICT(key) DO UPDATE SET value = @value');

for (const setting of updates) {
    const info = stmt.run(setting);
    console.log(`Updated ${setting.key}: ${info.changes} changes`);
}

console.log('Update complete.');
