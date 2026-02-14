import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Dashboard/Sidebar';
import Header from '../Dashboard/Header';

const AdminLayout = () => {
    return (
        <div className="bg-slate-50 min-h-screen flex font-display selection:bg-indigo-100 selection:text-indigo-900">
            <Sidebar />
            <div className="flex-1 lg:ml-64 p-4 md:p-8">
                <Header />
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
