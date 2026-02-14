'use server'

import { db } from '../../lib/db';
import { motorbikes } from '../../lib/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
// import { v4 as uuidv4 } from 'uuid'; // Removed in favor of crypto

export type Motorbike = Omit<typeof motorbikes.$inferSelect, 'imageUrls'> & { imageUrls: string[] };
export type NewMotorbike = typeof motorbikes.$inferInsert;

export async function getMotorbikes() {
    const data = await db.select().from(motorbikes).orderBy(desc(motorbikes.createdAt));
    // Parse imageUrls from JSON string
    return data.map(m => ({
        ...m,
        imageUrls: JSON.parse(m.imageUrls) as string[]
    }));
}

export async function addMotorbike(data: Omit<NewMotorbike, 'id' | 'createdAt' | 'imageUrls'> & { imageUrls: string[] }) {
    await db.insert(motorbikes).values({
        ...data,
        id: crypto.randomUUID(),
        imageUrls: JSON.stringify(data.imageUrls),
        createdAt: new Date(),
    });
    revalidatePath('/');
    revalidatePath('/admin');
}

export async function updateMotorbike(id: string, data: Partial<Omit<NewMotorbike, 'id' | 'createdAt' | 'imageUrls'> & { imageUrls: string[] }>) {
    const updateData: any = { ...data };
    if (data.imageUrls) {
        updateData.imageUrls = JSON.stringify(data.imageUrls);
    }

    await db.update(motorbikes).set(updateData).where(eq(motorbikes.id, id));
    revalidatePath('/');
    revalidatePath('/admin');
}

export async function deleteMotorbike(id: string) {
    await db.delete(motorbikes).where(eq(motorbikes.id, id));
    revalidatePath('/');
    revalidatePath('/admin');
}
