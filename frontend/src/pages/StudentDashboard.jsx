import React from 'react';
import { useAuth } from '../context/AuthContext';

const StudentDashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-background-light font-display p-4 md:p-8 relative overflow-hidden">
            <div className="campus-pattern opacity-10"></div>
            <div className="architectural-overlay"></div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <header className="flex justify-between items-center mb-10 bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-white shadow-xl">
                    <div className="flex items-center gap-4">
                        <div className="bg-primary text-white p-3 rounded-2xl shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined text-2xl">school</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 leading-none">Student Portal</h1>
                            <p className="text-xs text-slate-500 font-bold mt-1.5 uppercase tracking-widest">Personal Dashboard</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-black text-slate-900">{user?.name}</p>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-tighter">Student Account</p>
                        </div>
                        <button onClick={logout} className="p-3 bg-slate-50 text-slate-600 rounded-2xl hover:text-red-500 hover:bg-red-50 transition-all border border-slate-100">
                            <span className="material-symbols-outlined">logout</span>
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Profile Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white text-center">
                            <div className="relative inline-block mb-6">
                                <div className="w-32 h-32 rounded-3xl bg-slate-100 overflow-hidden border-4 border-slate-50 shadow-inner flex items-center justify-center mx-auto">
                                    <span className="material-symbols-outlined text-6xl text-slate-300">account_circle</span>
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white rounded-full p-2 border-4 border-white shadow-lg shadow-emerald-200">
                                    <span className="material-symbols-outlined text-sm font-bold">verified</span>
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-1">{user?.name}</h2>
                            <p className="text-slate-500 text-sm font-medium mb-6">ID: {user?.student_id}</p>

                            <div className="space-y-3 pt-6 border-t border-slate-50">
                                <ProfileDetail label="Email Address" value={user?.email} icon="mail" />
                                <ProfileDetail label="User Role" value="Student" icon="badge" />
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-primary to-blue-600 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-8xl">qr_code_2</span>
                            </div>
                            <h3 className="text-lg font-black mb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined">identity_platform</span> Digital ID
                            </h3>
                            <p className="text-sm text-blue-50 font-medium mb-6">Your unique digital identity for smart attendance.</p>
                            <button className="w-full py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-xl">qr_code_scanner</span>
                                View QR Code
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Welcome Card */}
                        <div className="bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                            <h2 className="text-3xl font-black text-slate-900 mb-2 relative">Welcome Back!</h2>
                            <p className="text-slate-500 font-medium mb-8 relative">Track your attendance and academic progress seamlessly.</p>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 relative">
                                <StatBox label="Total Presence" value="84%" icon="check_circle" color="emerald" />
                                <StatBox label="Upcoming Classes" value="4" icon="calendar_month" color="primary" />
                                <StatBox label="Notifications" value="2 New" icon="notifications_active" color="amber" />
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="font-black text-slate-900 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">history</span> Recent Attendance
                                </h3>
                                <button className="text-xs font-bold text-primary hover:underline uppercase tracking-widest">View Full History</button>
                            </div>

                            <div className="space-y-4">
                                <AttendanceItem date="Today, Oct 12" time="09:15 AM" status="Present" success />
                                <AttendanceItem date="Yesterday, Oct 11" time="10:30 AM" status="Present" success />
                                <AttendanceItem date="Oct 10, 2023" time="11:45 AM" status="Excused" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProfileDetail = ({ label, value, icon }) => (
    <div className="flex items-center gap-4 text-left p-3 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-slate-50/50 transition-all">
        <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
            <span className="material-symbols-outlined text-xl">{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">{label}</p>
            <p className="text-sm font-bold text-slate-700 truncate">{value}</p>
        </div>
    </div>
);

const StatBox = ({ label, value, icon, color }) => (
    <div className={`bg-slate-50 p-6 rounded-3xl border border-slate-100 transition-all hover:bg-${color}-50/50 hover:border-${color}-100 group`}>
        <div className={`inline-flex p-3 rounded-2xl bg-${color}-100 text-${color}-600 mb-4 group-hover:scale-110 transition-transform`}>
            <span className="material-symbols-outlined">{icon}</span>
        </div>
        <h4 className="text-xl font-black text-slate-900 mb-1">{value}</h4>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{label}</p>
    </div>
);

const AttendanceItem = ({ date, time, status, success }) => (
    <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 hover:bg-slate-50/80 transition-all">
        <div className="flex items-center gap-4">
            <div className={`p-2.5 rounded-xl ${success ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-100 text-slate-400'}`}>
                <span className="material-symbols-outlined">{success ? 'verified' : 'history'}</span>
            </div>
            <div>
                <p className="text-sm font-bold text-slate-800">{date}</p>
                <p className="text-[11px] text-slate-500 font-medium">{time}</p>
            </div>
        </div>
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${success ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
            {status}
        </span>
    </div>
);

export default StudentDashboard;
