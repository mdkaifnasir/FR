import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Header = ({ title }) => {
    const { user } = useAuth();

    return (
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <h1 className="text-2xl font-black text-slate-900">{title || 'Analytics'}</h1>
            </div>

            <div className="flex items-center gap-4 bg-white p-1 rounded-2xl border border-slate-100 shadow-sm w-fit">
                <button className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-md">
                    Full Statistics
                </button>
                <button className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-50 text-xs font-bold transition-colors">
                    Results Summary
                </button>
            </div>

            <div className="flex items-center gap-4 ml-auto md:ml-0">
                <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-colors bg-white">
                    <span className="material-symbols-outlined">add</span>
                </button>
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-500 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white">
                        {user?.name?.charAt(0) || 'A'}
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-sm font-bold text-slate-900 leading-none">{user?.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{user?.role}</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
