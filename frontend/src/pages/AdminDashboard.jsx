import React, { useState, useEffect } from 'react';
import StatsCard from '../components/Dashboard/StatsCard';
import axios from 'axios';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        total_students: 0,
        present_today: 0,
        late_today: 0,
        absent_today: 0,
        recent_activity: [],
        attendance_trend: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://127.0.0.1:8000/api/dashboard-stats', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const trendData = stats.attendance_trend || [];
    const maxCount = Math.max(...trendData.map(d => d.count), 1);

    return (
        <div>
            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                {/* Stats Column */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="h-48">
                            <StatsCard
                                title="Total Students"
                                value={stats.total_students}
                                icon="groups"
                                color="indigo"
                                subText="Registered"
                            />
                        </div>
                        <div className="h-48">
                            <StatsCard
                                title="Present Today"
                                value={stats.present_today}
                                icon="check_circle"
                                color="emerald"
                                trend="up"
                                trendValue={`${Math.round((stats.present_today / Math.max(stats.total_students, 1)) * 100)}%`}
                                subText="Attendance Rate"
                            />
                        </div>
                        <div className="h-48">
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-full flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-slate-500 font-bold text-sm mb-1">Weekly Trend</h3>
                                        <span className="text-xs font-bold px-2 py-1 rounded-md bg-emerald-50 text-emerald-600">Last 7 Days</span>
                                    </div>
                                </div>
                                <div className="flex items-end gap-2 h-20 mt-2">
                                    {trendData.map((day, index) => (
                                        <div key={index} className="flex-1 flex flex-col justify-end group relative">
                                            <div
                                                className="bg-indigo-400 rounded-t-sm w-full transition-all duration-500 hover:bg-indigo-600"
                                                style={{ height: `${(day.count / maxCount) * 100}%`, minHeight: '4px' }}
                                            ></div>
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                {day.count} ({day.day})
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Column (Absent/Late) */}
                <div className="lg:col-span-1 h-48">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-full flex flex-col justify-between relative overflow-hidden">
                        <div className="z-10">
                            <h3 className="text-slate-500 font-bold text-sm mb-1">Absent Today</h3>
                            <h2 className="text-3xl font-black text-slate-800">{stats.absent_today}</h2>
                        </div>
                        <div className="z-10 mt-auto">
                            <h3 className="text-slate-500 font-bold text-sm mb-1">Late Arrivals</h3>
                            <h2 className="text-2xl font-black text-amber-500">{stats.late_today}</h2>
                        </div>
                        <div className="absolute -right-6 -bottom-6 text-slate-50 opacity-50">
                            <span className="material-symbols-outlined text-[100px]">person_off</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity & System Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="mt-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-900 text-lg">Recent Activity</h3>
                    </div>
                    <div className="space-y-4">
                        {stats.recent_activity.length > 0 ? (
                            stats.recent_activity.map((activity, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-50 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold uppercase overflow-hidden">
                                            {activity.student?.name ? activity.student.name.substring(0, 2) : 'St'}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm">{activity.student?.name || 'Unknown Student'}</h4>
                                            <p className="text-[10px] text-slate-400 font-medium">
                                                {new Date(activity.detected_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide 
                                    ${activity.status === 'present' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                        {activity.status}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center p-8 text-slate-400 text-sm bg-white rounded-2xl border border-slate-50">No recent activity</div>
                        )}
                    </div>
                </div>

                {/* System Status / Placeholder */}
                <div className="mt-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-900 text-lg">System Status</h3>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 h-64 flex flex-col justify-center items-center text-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
                            <span className="material-symbols-outlined text-4xl text-emerald-500">check_circle</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-lg">System Operational</h4>
                            <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto">
                                Biometric services and camera feeds are running normally. No issues detected.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
