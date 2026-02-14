import { db } from './lib/db';
import { motorbikes, categories, settings } from './lib/schema';
import * as dotenv from 'dotenv';
// import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const main = async () => {
    console.log('Seeding data...');

    // Categories
    const cats = ['Matic', 'Sport', 'Bebek', 'Moge', 'Trail'].map(name => ({
        id: crypto.randomUUID(),
        name,
    }));

    try {
        await db.insert(categories).values(cats).onConflictDoNothing();
        console.log('Categories seeded.');
    } catch (e) {
        console.log('Categories already exist or error:', e);
    }

    // Settings
    const defaultSettings = [
        { key: 'storeName', value: 'Garasi Roda Dua' },
        { key: 'whatsappNumber', value: '628123456789' },
        { key: 'pixelId', value: '' },
        { key: 'leftAdCode', value: '' },
        { key: 'rightAdCode', value: '' },
        { key: 'adminPassword', value: 'admin123' },
    ];

    try {
        await db.insert(settings).values(defaultSettings).onConflictDoNothing();
        console.log('Settings seeded.');
    } catch (e) {
        console.log('Settings already exist or error:', e);
    }

    // Sample Motorbike
    const sampleMotor = {
        id: crypto.randomUUID(),
        name: 'Yamaha NMAX 155 Connected',
        price: 31500000,
        category: 'Matic',
        year: 2023,
        location: 'Jakarta Selatan',
        imageUrls: JSON.stringify(['https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=2900&auto=format&fit=crop']),
        createdAt: new Date(),
    };

    try {
        await db.insert(motorbikes).values(sampleMotor).onConflictDoNothing();
        console.log('Sample motorbike seeded.');
    } catch (e) {
        console.log('Motorbike error:', e);
    }

    console.log('Seeding complete.');
};

main();
