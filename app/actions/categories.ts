'use server'

import { db } from '../../lib/db';
import { categories } from '../../lib/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
// import { v4 as uuidv4 } from 'uuid';

export type Category = typeof categories.$inferSelect;

export async function getCategories() {
    return await db.select().from(categories);
}

export async function addCategory(name: string) {
    await db.insert(categories).values({
        id: crypto.randomUUID(),
        name,
    });
    revalidatePath('/');
    revalidatePath('/admin');
}

export async function deleteCategory(id: string) {
    await db.delete(categories).where(eq(categories.id, id));
    revalidatePath('/');
    revalidatePath('/admin');
}
