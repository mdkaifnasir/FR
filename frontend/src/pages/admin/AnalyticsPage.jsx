import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const AnalyticsPage = () => {
    const [stats, setStats] = useState(null);
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
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    // Prepare data for charts
    const trendData = stats?.attendance_trend?.map(item => ({
        name: item.day,
        Present: item.count,
        date: item.date
    })) || [];

    // Mock data for other charts since backend doesn't provide them yet
    const courseAttendanceData = [
        { name: 'CS101', rate: 85 },
        { name: 'ENG201', rate: 72 },
        { name: 'MATH301', rate: 90 },
        { name: 'PHY101', rate: 65 },
        { name: 'CHEM101', rate: 78 },
    ];

    const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#10b981'];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-black text-slate-800">Analytics & Reports</h1>
                <p className="text-slate-500 text-sm">Visual insights into attendance patterns and student engagement.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Weekly Attendance Trend */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800 mb-6">Weekly Attendance Trend</h2>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData}>
                                <defs>
                                    <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ color: '#6366f1', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="Present" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorPresent)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Course Attendance Rates */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800 mb-6">Average Attendance by Course</h2>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={courseAttendanceData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} width={80} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px' }} />
                                <Bar dataKey="rate" radius={[0, 4, 4, 0]} barSize={20}>
                                    {courseAttendanceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Avg. Daily Attendance</p>
                        <h3 className="text-3xl font-black text-slate-800">87%</h3>
                        <p className="text-xs font-bold text-emerald-500 mt-2 flex items-center">
                            <span className="material-symbols-outlined text-sm mr-1">trending_up</span> +2.4% vs last week
                        </p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <span className="material-symbols-outlined">group</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Late Arrivals</p>
                        <h3 className="text-3xl font-black text-slate-800">12</h3>
                        <p className="text-xs font-bold text-rose-500 mt-2 flex items-center">
                            <span className="material-symbols-outlined text-sm mr-1">trending_down</span> -5% vs last week
                        </p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                        <span className="material-symbols-outlined">schedule</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Most Active Class</p>
                        <h3 className="text-3xl font-black text-slate-800">CS101</h3>
                        <p className="text-xs font-bold text-slate-400 mt-2">Computer Science 1st Year</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <span className="material-symbols-outlined">star</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
