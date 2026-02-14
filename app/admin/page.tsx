import { checkAuth } from '../actions/auth';
import { AdminDashboard } from '@/components/AdminDashboard';
import ClientOnly from '@/components/ClientOnly';
import { LoginPage } from '@/components/LoginPage';
import { getMotorbikes } from '../actions/motorbikes';
import { getCategories } from '../actions/categories';
import { getSettings } from '../actions/settings';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default async function AdminPage() {
    const isAuthenticated = await checkAuth();

    if (!isAuthenticated) {
        return (
            <ClientOnly>
                <LoginPage />
            </ClientOnly>
        );
    }

    const [motorbikes, categories, settings] = await Promise.all([
        getMotorbikes(),
        getCategories(),
        getSettings()
    ]);

    return (
        <ClientOnly>
            <AdminDashboard
                initialMotorbikes={motorbikes}
                initialCategories={categories}
                initialSettings={settings}
            />
        </ClientOnly>
    );
}
