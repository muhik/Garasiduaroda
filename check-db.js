const Database = require('better-sqlite3');
const db = new Database('sqlite.db', { verbose: console.log });

console.log('--- Categories ---');
const categories = db.prepare('SELECT * FROM categories').all();
console.table(categories);

console.log('\n--- Settings ---');
const settings = db.prepare('SELECT * FROM settings').all();
console.table(settings);

console.log('\n--- Motorbikes ---');
const motorbikes = db.prepare('SELECT * FROM motorbikes').all();
console.table(motorbikes);
