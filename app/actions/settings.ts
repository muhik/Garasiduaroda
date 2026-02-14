'use server'

import { db } from '../../lib/db';
import { settings } from '../../lib/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export type Setting = typeof settings.$inferSelect;

export async function getSettings() {
    const allSettings = await db.select().from(settings);
    // Convert array to object for easier consumption
    const settingsObj: Record<string, string> = {};
    allSettings.forEach(s => {
        settingsObj[s.key] = s.value;
    });
    return settingsObj;
}

export async function updateSettings(newSettings: Record<string, string>) {
    // Upsert each setting
    for (const [key, value] of Object.entries(newSettings)) {
        await db.insert(settings)
            .values({ key, value })
            .onConflictDoUpdate({ target: settings.key, set: { value } });
    }
    revalidatePath('/');
    revalidatePath('/admin');
}
