import { db } from './lib/db';
import { settings } from './lib/schema';
import { eq } from 'drizzle-orm';

const update = async () => {
    console.log('Updating store name...');
    try {
        await db.update(settings)
            .set({ value: 'Garasi Roda Dua' })
            .where(eq(settings.key, 'storeName'));
        console.log('Store name updated to Garasi Roda Dua');
    } catch (e) {
        console.error('Error updating store name:', e);
    }
};

update();
