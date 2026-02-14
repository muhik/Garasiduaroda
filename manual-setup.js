const Database = require('better-sqlite3');
const crypto = require('crypto');

const db = new Database('sqlite.db', { verbose: console.log });

console.log('Dropping existing tables...');
db.exec('DROP TABLE IF EXISTS motorbikes');
db.exec('DROP TABLE IF EXISTS categories');
db.exec('DROP TABLE IF EXISTS settings');

console.log('Creating tables...');

db.exec(`
  CREATE TABLE motorbikes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    category TEXT NOT NULL,
    year INTEGER NOT NULL,
    location TEXT NOT NULL,
    image_urls TEXT NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
  )
`);

db.exec(`
  CREATE TABLE categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
  )
`);

db.exec(`
  CREATE TABLE settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  )
`);

console.log('Seeding data...');

// Categories
const insertCategory = db.prepare('INSERT INTO categories (id, name) VALUES (?, ?)');
['Matic', 'Sport', 'Bebek', 'Moge', 'Trail'].forEach(name => {
    insertCategory.run(crypto.randomUUID(), name);
});

// Settings
const insertSetting = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
const settings = [
    { key: 'storeName', value: 'IndoMotor Bekas' },
    { key: 'whatsappNumber', value: '628123456789' },
    { key: 'pixelId', value: '' },
    { key: 'leftAdCode', value: '' },
    { key: 'rightAdCode', value: '' },
    { key: 'adminPassword', value: 'admin123' },
];
settings.forEach(s => insertSetting.run(s.key, s.value));

// Motorbike
const insertMotor = db.prepare(`
  INSERT INTO motorbikes (id, name, price, category, year, location, image_urls, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

insertMotor.run(
    crypto.randomUUID(),
    'Yamaha NMAX 155 Connected',
    31500000,
    'Matic',
    2023,
    'Jakarta Selatan',
    JSON.stringify(['https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=2900&auto=format&fit=crop']),
    Date.now()
);

console.log('Database setup complete.');
