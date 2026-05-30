'use client';
import { useState, ReactNode } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface AdminLayoutProps {
    children: (activePage: string, setPage: (page: string) => void) => ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const [activePage, setActivePage] = useState('dashboard');

    const getPageTitle = (id: string) => {
        switch (id) {
            case 'dashboard': return 'Operations Dashboard';
            case 'moderation': return 'Product Moderation Queue';
            case 'catalogue': return 'Master Catalogue Manager';
            case 'wholesalers': return 'Sellers Directory';
            case 'retailers': return 'Retailers Directory';
            case 'orders': return 'Marketplace Orders';
            default: return 'Admin Portal';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar activePage={activePage} onPageChange={setActivePage} />

            <div className="flex-1 ml-[260px] flex flex-col min-w-[940px]">
                <Topbar title={getPageTitle(activePage)} />

                <main className="p-8 flex-1">
                    {children(activePage, setActivePage)}
                </main>
            </div>
        </div>
    );
}
