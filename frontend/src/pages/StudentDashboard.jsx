import React from 'react';
import { useAuth } from '../context/AuthContext';

const StudentDashboard = () => {
    const { user, logout } = useAuth();
    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="flex h-screen bg-[#F0F5FA] font-sans text-[#1A1C1E]">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-[#E1E6EB] flex flex-col shrink-0">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#137FEC] rounded-xl flex items-center justify-center shadow-lg shadow-blue-100">
                        <span className="material-symbols-outlined text-white text-2xl">face_unlock</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-[#137FEC]">AttendFace</span>
                </div>

                <nav className="mt-6 px-4 flex-1 space-y-1">
                    <NavItem icon="dashboard" label="Dashboard" active />
                    <NavItem icon="calendar_today" label="My Attendance" />
                    <NavItem icon="person" label="Profile" />
                    <NavItem icon="notifications" label="Notifications" />
                    <NavItem icon="help" label="Help" />
                </nav>

                <div className="p-6 bg-[#F8FAFC] border-t border-[#E1E6EB]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="User" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate">{user?.name || 'Alex Johnson'}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">ID: {user?.student_id || '2024CS082'}</p>
                        </div>
                        <button onClick={logout} className="text-slate-400 hover:text-red-500 transition-colors">
                            <span className="material-symbols-outlined text-xl">logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8 lg:p-10">
                {/* Header */}
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-extrabold text-[#1A1C1E] tracking-tight">Welcome back, {user?.name?.split(' ')[0] || 'Alex'}!</h1>
                        <p className="text-sm text-[#74777F] font-medium mt-1">Today is {currentDate}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-3 bg-white rounded-xl shadow-sm border border-[#E1E6EB] text-[#74777F] hover:bg-slate-50 transition-all">
                            <span className="material-symbols-outlined text-xl">search</span>
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3 bg-[#137FEC] text-white rounded-xl font-bold border-b-4 border-blue-700 shadow-xl shadow-blue-100 hover:translate-y-[1px] hover:border-b-2 active:translate-y-[4px] active:border-b-0 transition-all group">
                            <span className="material-symbols-outlined text-lg group-hover:rotate-12 transition-transform">photo_camera</span>
                            Quick Check-in
                        </button>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                    <OverallAttendanceCard percentage={88} trend="+2.4% from last month" />
                    <LastCheckInCard time="10:15 AM" location="Computer Science Lab - B3" />
                    <TotalClassesCard attended={42} total={48} remaining={6} />
                </div>

                {/* Middle Section: Trends & Upcoming */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Attendance Trends */}
                    <div className="lg:col-span-3 bg-white p-8 rounded-[2.5rem] shadow-sm border border-[#E1E6EB]">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-bold">Monthly Attendance Trends</h3>
                            <div className="relative">
                                <select className="appearance-none bg-[#F8FAFC] border border-[#E1E6EB] rounded-2xl px-5 py-2.5 text-xs font-bold pr-10 outline-none">
                                    <option>October 2023</option>
                                    <option>September 2023</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-lg text-slate-400 pointer-events-none">expand_more</span>
                            </div>
                        </div>

                        <div className="h-64 flex items-end justify-between px-4 mt-4 mb-2">
                            <Bar day="Mon" height="75%" />
                            <Bar day="Tue" height="55%" />
                            <Bar day="Wed" height="90%" active />
                            <Bar day="Thu" height="45%" />
                            <Bar day="Fri" height="85%" />
                            <Bar day="Sat" height="0%" />
                            <Bar day="Sun" height="0%" />
                        </div>
                    </div>

                    {/* Upcoming Classes */}
                    <div className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] shadow-sm border border-[#E1E6EB]">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-bold">Upcoming Classes</h3>
                            <span className="px-3 py-1 bg-blue-50 text-[#137FEC] text-[10px] font-black rounded-lg uppercase">3 Today</span>
                        </div>

                        <div className="space-y-6">
                            <ClassItem
                                name="Data Structures"
                                time="02:00 PM"
                                room="Room 402"
                                status="Face Check-in Ready"
                                startTime="45m"
                                color="emerald"
                            />
                            <ClassItem
                                name="Software Engineering"
                                time="04:00 PM"
                                room="Online (Teams)"
                                status="Scheduled"
                                footer="Wait for class to start"
                                color="slate"
                            />
                            <ClassItem
                                name="Discrete Mathematics"
                                time="Tomorrow"
                                room="Room 102"
                                status="Tomorrow"
                                footer="09:00 AM"
                                color="slate"
                            />
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Recent Activity Table */}
                <div className="mt-10 bg-white p-8 rounded-[2.5rem] shadow-sm border border-[#E1E6EB]">
                    <h3 className="text-xl font-bold mb-8">Recent Attendance Activity</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-[#A1A5B7] text-[11px] font-bold uppercase tracking-widest border-b border-slate-50">
                                <tr>
                                    <th className="pb-4">Course Name</th>
                                    <th className="pb-4">Date</th>
                                    <th className="pb-4">Time</th>
                                    <th className="pb-4">Verification</th>
                                    <th className="pb-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                <ActivityRow
                                    course="Artificial Intelligence"
                                    date="Oct 20, 2023"
                                    time="10:15 AM"
                                    confidence="98.2%"
                                    status="Present"
                                />
                                <ActivityRow
                                    course="Cloud Computing"
                                    date="Oct 19, 2023"
                                    time="02:00 PM"
                                    confidence="95.5%"
                                    status="Present"
                                />
                                <ActivityRow
                                    course="Network Security"
                                    date="Oct 18, 2023"
                                    time="09:00 AM"
                                    confidence="99.1%"
                                    status="Present"
                                />
                                <ActivityRow
                                    course="Database Systems"
                                    date="Oct 17, 2023"
                                    time="11:30 AM"
                                    confidence="97.8%"
                                    status="Present"
                                />
                                <ActivityRow
                                    course="Machine Learning"
                                    date="Oct 16, 2023"
                                    time="01:45 PM"
                                    confidence="96.4%"
                                    status="Present"
                                />
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

const NavItem = ({ icon, label, active }) => (
    <a href="#" className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all group ${active ? 'bg-[#137FEC] text-white shadow-lg shadow-blue-100' : 'text-[#74777F] hover:bg-slate-50 hover:text-[#1A1C1E]'}`}>
        <span className="material-symbols-outlined text-xl">{icon}</span>
        {label}
    </a>
);

const OverallAttendanceCard = ({ percentage, trend }) => (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-[#E1E6EB] flex items-center justify-between">
        <div>
            <p className="text-xs font-bold text-[#74777F] uppercase tracking-wider mb-2">Overall Attendance</p>
            <h4 className="text-4xl font-black text-[#1A1C1E] mb-2">{percentage}%</h4>
            <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-[11px]">
                <span className="material-symbols-outlined text-sm font-black">trending_up</span>
                {trend}
            </div>
        </div>
        <div className="relative w-20 h-20">
            <svg className="w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r="32" stroke="#F1F4F9" strokeWidth="8" fill="transparent" />
                <circle cx="40" cy="40" r="32" stroke="#137FEC" strokeWidth="8" fill="transparent" strokeDasharray={`${2 * Math.PI * 32}`} strokeDashoffset={`${2 * Math.PI * 32 * (1 - percentage / 100)}`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#137FEC] text-xl font-bold">done_all</span>
            </div>
        </div>
    </div>
);

const LastCheckInCard = ({ time, location }) => (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-[#E1E6EB]">
        <p className="text-xs font-bold text-[#74777F] uppercase tracking-wider mb-2">Last Check-in Time</p>
        <h4 className="text-4xl font-black text-[#1A1C1E] mb-4">{time}</h4>
        <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-slate-400 text-lg">location_on</span>
            <span className="text-[11px] font-bold text-slate-600">{location}</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-widest">Face Verified</span>
        </div>
    </div>
);

const TotalClassesCard = ({ attended, total, remaining }) => {
    const progress = (attended / total) * 100;
    return (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-[#E1E6EB]">
            <p className="text-xs font-bold text-[#74777F] uppercase tracking-wider mb-2">Total Classes Attended</p>
            <h4 className="text-4xl font-black text-[#1A1C1E] mb-4">{attended} <span className="text-slate-300">/ {total}</span></h4>
            <div className="w-full h-2.5 bg-[#F1F4F9] rounded-full mb-3 overflow-hidden">
                <div className="h-full bg-[#137FEC] rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="text-[11px] font-bold text-slate-400 italic font-medium">{remaining} classes remaining this semester</p>
        </div>
    );
};

const Bar = ({ day, height, active }) => (
    <div className="flex flex-col items-center gap-4 h-full group">
        <div className="relative flex-1 w-12 md:w-16 bg-[#F1F4F9] rounded-2xl overflow-hidden flex flex-col justify-end transition-all group-hover:bg-slate-100/50">
            <div
                className={`w-full rounded-2xl transition-all duration-700 ${active ? 'bg-[#137FEC]' : 'bg-[#137FEC]/60'}`}
                style={{ height }}
            ></div>
        </div>
        <span className={`text-[11px] font-bold uppercase tracking-tight ${active ? 'text-[#1A1C1E]' : 'text-[#A1A5B7]'}`}>{day}</span>
    </div>
);

const ClassItem = ({ name, time, room, status, startTime, footer, color }) => (
    <div className="group cursor-pointer">
        <div className="flex justify-between items-start mb-2">
            <h5 className="text-sm font-black text-[#1A1C1E] group-hover:text-[#137FEC] transition-colors">{name}</h5>
            {startTime && <span className="bg-amber-50 text-amber-600 text-[10px] font-black px-2 py-0.5 rounded">Starts in {startTime}</span>}
        </div>
        <div className="flex items-center gap-4 text-[11px] font-bold text-[#74777F] mb-3">
            <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-base">schedule</span>{time}</div>
            <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-base">door_front</span>{room}</div>
        </div>
        <button className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${color === 'emerald' ? 'bg-[#E7F7F0] text-[#00B26A] hover:bg-[#00B26A] hover:text-white' : 'bg-slate-50 text-slate-500 border border-slate-100 hover:bg-slate-100'}`}>
            <span className="material-symbols-outlined text-lg">{status === 'Face Check-in Ready' ? 'camera' : status === 'Scheduled' ? 'event' : 'event_available'}</span>
            {status}
        </button>
        {footer && <p className="text-[10px] text-slate-400 italic text-center mt-2 group-hover:text-slate-500 transition-colors uppercase tracking-widest font-bold">{footer}</p>}
    </div>
);

const ActivityRow = ({ course, date, time, confidence, status }) => (
    <tr className="group hover:bg-slate-50/50 transition-all">
        <td className="py-5 text-sm font-bold text-[#1A1C1E]">{course}</td>
        <td className="py-5 text-sm font-medium text-[#74777F]">{date}</td>
        <td className="py-5 text-sm font-medium text-[#74777F]">{time}</td>
        <td className="py-5">
            <div className="flex items-center gap-2 text-emerald-500">
                <span className="material-symbols-outlined text-base font-black">verified</span>
                <span className="text-[11px] font-black">{confidence} Confidence</span>
            </div>
        </td>
        <td className="py-5 text-right sm:text-left">
            <span className="px-4 py-1.5 bg-[#E7F7F0] text-[#00B26A] text-[10px] font-black rounded-lg uppercase tracking-widest">
                {status}
            </span>
        </td>
    </tr>
);

export default StudentDashboard;
