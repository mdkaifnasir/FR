import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SidebarItem = ({ icon, label, to, active }) => (
    <NavLink
        to={to}
        className={({ isActive }) => `
      flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group
      ${isActive
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-200'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
    `}
    >
        <span className={`material-symbols-outlined ${active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`}>
            {icon}
        </span>
        <span className="font-bold text-sm tracking-wide">{label}</span>
    </NavLink>
);

const Sidebar = () => {
    const { logout } = useAuth();

    return (
        <div className="w-64 h-screen bg-white border-r border-slate-100 flex flex-col p-6 fixed left-0 top-0 hidden lg:flex z-50">
            {/* Logo Area */}
            <div className="flex items-center gap-3 mb-10 px-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-200">
                    F
                </div>
                <h1 className="text-xl font-black text-slate-800 tracking-tight">Facial<span className="text-cyan-500">Rec</span></h1>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto space-y-8 no-scrollbar">
                <div>
                    <h3 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Main Menu</h3>
                    <div className="space-y-2">
                        <SidebarItem icon="dashboard" label="Dashboard" to="/dashboard" />
                        <SidebarItem icon="groups" label="Students" to="/students" />
                        <SidebarItem icon="school" label="Teachers" to="/teachers" />
                        <SidebarItem icon="book_2" label="Classes" to="/courses" />
                        <SidebarItem icon="videocam" label="Devices" to="/cameras" />
                        <SidebarItem icon="fact_check" label="Attendance" to="/attendance" />
                        <SidebarItem icon="bar_chart" label="Statistics" to="/stats" />
                    </div>
                </div>

                <div>
                    <h3 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Teams</h3>
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 px-4 py-2">
                            <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                            <span className="text-slate-600 font-bold text-sm">Engineering</span>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2">
                            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                            <span className="text-slate-600 font-bold text-sm">Design</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-auto space-y-2 pt-6 border-t border-slate-50">
                <SidebarItem icon="shield" label="Audit Logs" to="/audit-logs" />
                <button onClick={logout} className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200 group text-left">
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-rose-500">logout</span>
                    <span className="font-bold text-sm tracking-wide">Log Out</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
