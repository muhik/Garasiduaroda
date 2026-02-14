'use client';

import React, { useState } from 'react';
import {
    Plus,
    Trash2,
    Settings,
    LayoutDashboard,
    Bike,
    Tag,
    Eye,
    LogOut,
    Edit3,
    CheckCircle2,
    Image as ImageIcon
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { logout } from '@/app/actions/auth';
import {
    addMotorbike,
    updateMotorbike,
    deleteMotorbike,
    Motorbike
} from '@/app/actions/motorbikes';
import {
    addCategory,
    deleteCategory,
    Category
} from '@/app/actions/categories';
import {
    updateSettings
} from '@/app/actions/settings';

interface AdminDashboardProps {
    initialMotorbikes: Motorbike[];
    initialCategories: Category[];
    initialSettings: Record<string, string>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
    initialMotorbikes,
    initialCategories,
    initialSettings
}) => {
    const router = useRouter();
    const [adminTab, setAdminTab] = useState('motorbikes');
    const [loading, setLoading] = useState(false);

    // Data is passed from server component, but for optimistic UI/simplicity in this demo 
    // we rely on router.refresh() after actions to update this props data.
    const motorbikes = initialMotorbikes;
    const categories = initialCategories;
    const settings = initialSettings;

    // --- Motorbike State ---
    const [newMotor, setNewMotor] = useState({
        name: '', price: '', category: '', year: '', location: '', isSold: false,
        imageUrls: ['']
    });
    const [editingMotorId, setEditingMotorId] = useState<string | null>(null);

    // --- Category State ---
    const [newCategory, setNewCategory] = useState('');

    // --- Settings State ---
    const [tempSettings, setTempSettings] = useState(settings);

    // --- Handlers ---

    const handleLogout = async () => {
        await logout();
        window.location.href = '/'; // Go back to Home public view
    };

    const handleAddImageUrl = () => {
        setNewMotor(prev => ({ ...prev, imageUrls: [...prev.imageUrls, ''] }));
    };

    const handleImageUrlChange = (index: number, value: string) => {
        const updatedUrls = [...newMotor.imageUrls];
        updatedUrls[index] = value;
        setNewMotor({ ...newMotor, imageUrls: updatedUrls });
    };

    const handleRemoveImageUrl = (index: number) => {
        const updatedUrls = newMotor.imageUrls.filter((_, i) => i !== index);
        setNewMotor({ ...newMotor, imageUrls: updatedUrls.length ? updatedUrls : [''] });
    };

    const handleSaveMotor = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMotor.name || !newMotor.price) return;
        setLoading(true);

        const finalMotorData = {
            name: newMotor.name,
            price: parseInt(newMotor.price.toString().replace(/[^0-9]/g, '')),
            category: newMotor.category,
            year: parseInt(newMotor.year.toString()) || new Date().getFullYear(),
            location: newMotor.location,
            isSold: newMotor.isSold,
            imageUrls: newMotor.imageUrls.filter(url => url.trim() !== '')
        };

        try {
            if (editingMotorId) {
                await updateMotorbike(editingMotorId, finalMotorData);
                alert("Update Berhasil!");
            } else {
                await addMotorbike(finalMotorData);
                alert("Unit Ditambahkan!");
            }
            setNewMotor({ name: '', price: '', category: '', year: '', imageUrls: [''], location: '', isSold: false });
            setEditingMotorId(null);
            router.refresh(); // Refresh server data
        } catch (err) {
            alert("Gagal Simpan.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const startEdit = (motor: Motorbike) => {
        setNewMotor({
            name: motor.name || '',
            price: motor.price.toString() || '',
            category: motor.category || '',
            year: motor.year.toString() || '',
            location: motor.location || '',
            isSold: motor.isSold || false,
            imageUrls: motor.imageUrls?.length ? [...motor.imageUrls] : ['']
        });
        setEditingMotorId(motor.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setNewMotor({ name: '', price: '', category: '', year: '', imageUrls: [''], location: '', isSold: false });
        setEditingMotorId(null);
    };

    const handleDeleteMotor = async (id: string) => {
        if (confirm('Hapus data ini?')) {
            setLoading(true);
            await deleteMotorbike(id);
            if (editingMotorId === id) cancelEdit();
            setLoading(false);
            router.refresh();
        }
    }

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategory) return;
        setLoading(true);
        await addCategory(newCategory);
        setNewCategory('');
        setLoading(false);
        router.refresh();
    };

    const handleDeleteCategory = async (id: string) => {
        if (confirm('Hapus kategori ini?')) {
            setLoading(true);
            await deleteCategory(id);
            setLoading(false);
            router.refresh();
        }
    };

    const handleSaveSettings = async () => {
        setLoading(true);
        await updateSettings(tempSettings);
        alert("Settings Disimpan!");
        setLoading(false);
        router.refresh();
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };


    return (
        <div className="min-h-screen bg-stone-50 flex flex-col lg:flex-row font-sans" suppressHydrationWarning>
            <div className="w-full lg:w-80 bg-stone-900 text-stone-400 p-8 flex flex-col" suppressHydrationWarning>
                <div className="flex items-center gap-3 mb-12">
                    <div className="bg-emerald-600 p-2 rounded-2xl shadow-lg shadow-emerald-600/20 text-white"><LayoutDashboard size={24} /></div>
                    <span className="font-black text-white text-xl tracking-tight">Console Pro</span>
                </div>
                <nav className="space-y-3 flex-1">
                    {[
                        { id: 'motorbikes', label: 'Unit Katalog', icon: <Bike size={20} /> },
                        { id: 'categories', label: 'Kategori Produk', icon: <Tag size={20} /> },
                        { id: 'settings', label: 'Config & Keamanan', icon: <Settings size={20} /> }
                    ].map(item => (
                        <button key={item.id} onClick={() => setAdminTab(item.id)} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-black transition-all ${adminTab === item.id ? 'bg-emerald-700 text-white shadow-xl shadow-emerald-700/20' : 'hover:bg-stone-800 hover:text-stone-100'}`}>
                            {item.icon} {item.label}
                        </button>
                    ))}
                </nav>
                <div className="pt-8 border-t border-stone-800 space-y-3">
                    <a href="/" target="_blank" className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold border border-stone-800 hover:bg-stone-800 hover:text-white transition-all"><Eye size={20} /> Preview Web</a>
                    <button onClick={handleLogout} className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold text-orange-400 hover:bg-orange-400/10 transition-all"><LogOut size={20} /> Tutup Sesi</button>
                </div>
            </div>

            <div className="flex-1 p-8 sm:p-14 overflow-y-auto" suppressHydrationWarning>
                {loading && <div className="fixed top-0 left-0 w-full h-1 bg-emerald-200 overflow-hidden z-50"><div className="w-full h-full bg-emerald-600 animate-pulse origin-left"></div></div>}

                {adminTab === 'motorbikes' && (
                    <div className="max-w-5xl animate-in fade-in duration-500">
                        <div className="mb-10">
                            <h2 className="text-3xl font-black text-stone-800 mb-2">{editingMotorId ? 'Perbarui Unit' : 'Katalog Unit Baru'}</h2>
                            <p className="text-stone-500 font-medium">{editingMotorId ? 'Sesuaikan data unit yang sudah terdaftar.' : 'Lengkapi data unit motor untuk ditayangkan.'}</p>
                        </div>

                        <form onSubmit={handleSaveMotor} className={`p-8 rounded-[2.5rem] shadow-sm border mb-12 grid grid-cols-1 sm:grid-cols-2 gap-6 transition-all ${editingMotorId ? 'bg-orange-50/50 border-orange-100' : 'bg-white border-stone-200'}`}>
                            <div className="sm:col-span-2">
                                <label className="text-[11px] font-black text-stone-400 uppercase mb-2 block tracking-widest">Model & Nama Motor</label>
                                <input required className="w-full p-4 rounded-2xl bg-stone-50 border border-stone-100 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none font-bold" placeholder="Contoh: Yamaha NMAX 155 Connected" value={newMotor.name} onChange={e => setNewMotor({ ...newMotor, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-[11px] font-black text-stone-400 uppercase mb-2 block tracking-widest">Harga Jual (IDR)</label>
                                <input required type="number" className="w-full p-4 rounded-2xl bg-stone-50 border border-stone-100 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none font-bold" placeholder="35000000" value={newMotor.price} onChange={e => setNewMotor({ ...newMotor, price: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-[11px] font-black text-stone-400 uppercase mb-2 block tracking-widest">Kategori Unit</label>
                                <select required className="w-full p-4 rounded-2xl bg-stone-50 border border-stone-100 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none font-bold appearance-none" value={newMotor.category} onChange={e => setNewMotor({ ...newMotor, category: e.target.value })}>
                                    <option value="">Pilih Kategori</option>
                                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                </select>
                            </div>

                            <div className="sm:col-span-2 space-y-3">
                                <label className="text-[11px] font-black text-stone-400 uppercase block tracking-widest">Kumpulan URL Foto Unit</label>
                                {newMotor.imageUrls.map((url, index) => (
                                    <div key={index} className="flex gap-3">
                                        <input className="flex-1 p-4 rounded-2xl bg-stone-50 border border-stone-100 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none text-sm font-medium" placeholder={`Paste link foto ${index + 1} disini...`} value={url} onChange={(e) => handleImageUrlChange(index, e.target.value)} />
                                        <button type="button" onClick={() => handleRemoveImageUrl(index)} className="p-4 text-stone-300 hover:text-orange-500 transition-colors"><Trash2 size={20} /></button>
                                    </div>
                                ))}
                                <button type="button" onClick={handleAddImageUrl} className="flex items-center gap-2 text-emerald-700 font-black text-xs hover:text-emerald-800 py-2 uppercase tracking-widest"><Plus size={16} /> Tambah Slot Foto</button>
                            </div>

                            <div>
                                <label className="text-[11px] font-black text-stone-400 uppercase mb-2 block tracking-widest">Tahun Produksi</label>
                                <input required className="w-full p-4 rounded-2xl bg-stone-50 border border-stone-100 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none font-bold" placeholder="2024" value={newMotor.year} onChange={e => setNewMotor({ ...newMotor, year: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-[11px] font-black text-stone-400 uppercase mb-2 block tracking-widest">Lokasi Sekarang</label>
                                <input required className="w-full p-4 rounded-2xl bg-stone-50 border border-stone-100 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none font-bold" placeholder="Cabang Jakarta" value={newMotor.location} onChange={e => setNewMotor({ ...newMotor, location: e.target.value })} />
                            </div>

                            <div className="sm:col-span-2 flex items-center gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-100">
                                <input
                                    type="checkbox"
                                    id="isSold"
                                    className="w-6 h-6 rounded-lg text-emerald-600 focus:ring-emerald-500 border-gray-300"
                                    checked={newMotor.isSold || false}
                                    onChange={e => setNewMotor({ ...newMotor, isSold: e.target.checked })}
                                />
                                <label htmlFor="isSold" className="text-sm font-black text-stone-600 cursor-pointer select-none">Tandai Sudah Terjual (SOLD)</label>
                            </div>

                            <div className="sm:col-span-2 flex gap-4 mt-4">
                                <button disabled={loading} type="submit" className={`flex-1 font-black py-5 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 ${editingMotorId ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20' : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-700/20'}`}>
                                    {editingMotorId ? <CheckCircle2 size={24} /> : <Plus size={24} />}
                                    {editingMotorId ? 'Simpan Update' : 'Tayangkan Unit'}
                                </button>
                                {editingMotorId && (
                                    <button type="button" onClick={cancelEdit} className="px-8 py-5 bg-white border border-stone-200 rounded-2xl font-black text-stone-400 hover:bg-stone-50 hover:text-stone-600 transition-all uppercase tracking-widest text-xs">Batal</button>
                                )}
                            </div>
                        </form>

                        <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-stone-50 border-b border-stone-100">
                                    <tr>
                                        <th className="px-8 py-5 text-[11px] font-black text-stone-400 uppercase tracking-widest">Info Unit</th>
                                        <th className="px-8 py-5 text-[11px] font-black text-stone-400 uppercase tracking-widest">Harga</th>
                                        <th className="px-8 py-5 text-[11px] font-black text-stone-400 uppercase tracking-widest text-center">Tindakan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-50">
                                    {motorbikes.map(m => (
                                        <tr key={m.id} className={`hover:bg-stone-50/50 transition-colors ${editingMotorId === m.id ? 'bg-orange-50/30' : ''}`}>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-16 h-16 rounded-[1.25rem] bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                                                        {(m.imageUrls?.[0]) ? <img src={m.imageUrls?.[0]} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><ImageIcon size={24} className="text-stone-300" /></div>}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-stone-800 text-lg leading-tight flex items-center gap-2">
                                                            {m.name}
                                                            {m.isSold && <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full border border-red-200 uppercase tracking-widest">SOLD</span>}
                                                        </p>
                                                        <p className="text-xs text-stone-400 font-bold mt-1 uppercase tracking-wider">{m.category} • {m.year} • {m.imageUrls?.length || 0} Foto • {m.isSold ? 'Terjual' : 'Tersedia'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6"><span className="font-black text-emerald-700 text-lg">{formatPrice(m.price)}</span></td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center justify-center gap-3">
                                                    <button onClick={() => startEdit(m)} className={`p-3 rounded-xl transition-all ${editingMotorId === m.id ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-stone-50 text-stone-400 hover:text-emerald-600 hover:bg-emerald-50'}`}>
                                                        <Edit3 size={20} />
                                                    </button>
                                                    <button onClick={() => handleDeleteMotor(m.id)} className="p-3 bg-stone-50 text-stone-400 rounded-xl hover:text-orange-500 hover:bg-orange-50 transition-all">
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {motorbikes.length === 0 && (
                                        <tr><td colSpan={3} className="px-8 py-20 text-center text-stone-400 font-bold italic tracking-wide">Katalog masih kosong.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {adminTab === 'categories' && (
                    <div className="max-w-xl animate-in slide-in-from-bottom-6 duration-500">
                        <h2 className="text-3xl font-black text-stone-800 mb-8">Manajemen Kategori</h2>
                        <form onSubmit={handleAddCategory} className="flex gap-3 mb-12">
                            <input required className="flex-1 p-5 rounded-[1.5rem] bg-white border border-stone-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none font-bold shadow-sm" placeholder="Contoh: Matic, Moge, Bebek..." value={newCategory} onChange={e => setNewCategory(e.target.value)} />
                            <button disabled={loading} className="bg-emerald-700 text-white px-8 py-5 rounded-[1.5rem] font-black hover:bg-emerald-800 transition-all flex items-center gap-3 shadow-xl shadow-emerald-700/20 disabled:opacity-50">
                                <Plus size={24} /> Simpan
                            </button>
                        </form>
                        <div className="bg-white rounded-[2.5rem] border border-stone-200 shadow-sm overflow-hidden">
                            <div className="px-8 py-5 bg-stone-50 text-[10px] font-black text-stone-400 uppercase tracking-[0.3em]">Daftar Aktif</div>
                            <div className="divide-y divide-stone-50">
                                {categories.map(c => (
                                    <div key={c.id} className="px-8 py-5 flex justify-between items-center hover:bg-stone-50 transition-colors">
                                        <span className="font-black text-stone-700 tracking-tight">{c.name}</span>
                                        <button onClick={() => handleDeleteCategory(c.id)} className="text-stone-300 hover:text-orange-500 transition-colors"><Trash2 size={20} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {adminTab === 'settings' && (
                    <div className="max-w-3xl animate-in fade-in duration-500">
                        <h2 className="text-3xl font-black text-stone-800 mb-10">Konfigurasi Sistem</h2>
                        <div className="space-y-8 bg-white p-10 rounded-[3rem] border border-stone-200 shadow-sm">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div><label className="block text-[11px] font-black text-stone-400 uppercase mb-3 tracking-widest">Brand / Toko</label><input className="w-full p-4 rounded-2xl bg-stone-50 border border-stone-100 focus:border-emerald-500 outline-none font-bold" value={tempSettings.storeName || ''} onChange={e => setTempSettings({ ...tempSettings, storeName: e.target.value })} /></div>
                                <div><label className="block text-[11px] font-black text-stone-400 uppercase mb-3 tracking-widest">WhatsApp Admin</label><input className="w-full p-4 rounded-2xl bg-stone-50 border border-stone-100 focus:border-emerald-500 outline-none font-bold" value={tempSettings.whatsappNumber || ''} onChange={e => setTempSettings({ ...tempSettings, whatsappNumber: e.target.value })} /></div>
                                <div className="sm:col-span-2"><label className="block text-[11px] font-black text-stone-400 uppercase mb-3 tracking-widest">Facebook Pixel ID</label><input placeholder="Contoh: 1234567890" className="w-full p-4 rounded-2xl bg-stone-50 border border-stone-100 focus:border-emerald-500 outline-none font-bold font-mono text-stone-600" value={tempSettings.pixelId || ''} onChange={e => setTempSettings({ ...tempSettings, pixelId: e.target.value })} /></div>
                            </div>
                            <div>
                                <label className="block text-[11px] font-black text-stone-400 uppercase mb-3 tracking-widest">Kunci Admin Baru</label>
                                <input type="text" className="w-full p-4 rounded-2xl bg-stone-50 border border-stone-100 focus:border-emerald-500 outline-none font-mono text-emerald-700 font-bold" value={tempSettings.adminPassword || ''} onChange={e => setTempSettings({ ...tempSettings, adminPassword: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div><label className="block text-[11px] font-black text-stone-400 uppercase mb-3 tracking-widest">Iklan Samping Kiri</label><textarea className="w-full h-40 p-5 rounded-3xl bg-stone-50 border border-stone-100 focus:border-emerald-500 outline-none text-xs font-mono" value={tempSettings.leftAdCode || ''} onChange={e => setTempSettings({ ...tempSettings, leftAdCode: e.target.value })} /></div>
                                <div><label className="block text-[11px] font-black text-stone-400 uppercase mb-3 tracking-widest">Iklan Samping Kanan</label><textarea className="w-full h-40 p-5 rounded-3xl bg-stone-50 border border-stone-100 focus:border-emerald-500 outline-none text-xs font-mono" value={tempSettings.rightAdCode || ''} onChange={e => setTempSettings({ ...tempSettings, rightAdCode: e.target.value })} /></div>
                            </div>
                            <button onClick={handleSaveSettings} disabled={loading} className="w-full bg-stone-900 text-white font-black py-5 rounded-2xl hover:bg-emerald-800 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-stone-300 text-lg uppercase tracking-widest disabled:opacity-50">Perbarui Pengaturan</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
