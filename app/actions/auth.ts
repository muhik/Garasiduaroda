'use server'

import { cookies } from 'next/headers';
import { getSettings } from './settings';

export async function login(password: string) {
    const settings = await getSettings();
    const adminPassword = settings.adminPassword || 'admin123';

    if (password === adminPassword) {
        // Set a simple cookie
        const cookieStore = await cookies();
        cookieStore.set('admin_session', 'true', {
            secure: process.env.NODE_ENV === 'production',
            path: '/',
        });
        return { success: true };
    }

    return { success: false, error: 'Password salah' };
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');
    // Double ensure by setting empty cookie with immediate expiry
    cookieStore.set('admin_session', '', { maxAge: 0, path: '/' });
}

export async function checkAuth() {
    const cookieStore = await cookies();
    return cookieStore.has('admin_session');
}
