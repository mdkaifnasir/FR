import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AttendancePage = () => {
    const [attendance, setAttendance] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        course_id: '',
        date: '',
        status: ''
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        fetchAttendance();
    }, [filters]);

    const fetchInitialData = async () => {
        try {
            const token = localStorage.getItem('token');
            const coursesRes = await axios.get('http://127.0.0.1:8000/api/courses', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCourses(coursesRes.data);
        } catch (error) {
            console.error('Error fetching initial data:', error);
        }
    };

    const fetchAttendance = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const params = {};
            if (filters.course_id) params.course_id = filters.course_id;
            if (filters.date) params.date = filters.date;
            if (filters.status) params.status = filters.status;

            const response = await axios.get('http://127.0.0.1:8000/api/attendance', {
                headers: { Authorization: `Bearer ${token}` },
                params
            });
            setAttendance(response.data);
        } catch (error) {
            console.error('Error fetching attendance:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const exportToCSV = () => {
        const headers = ['Date', 'Time', 'Student Name', 'ID', 'Course', 'Status', 'Method'];
        const rows = attendance.map(record => [
            new Date(record.detected_at).toLocaleDateString(),
            new Date(record.detected_at).toLocaleTimeString(),
            record.student?.name || 'Unknown',
            record.student?.student_id || 'N/A',
            record.course?.code || 'N/A',
            record.status,
            record.method
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `attendance_report_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">Attendance Logs</h1>
                    <p className="text-slate-500 text-sm">View and export detailed attendance records.</p>
                </div>
                <button
                    onClick={exportToCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 font-bold rounded-xl border border-emerald-100 hover:bg-emerald-100 transition-colors"
                >
                    <span className="material-symbols-outlined">download</span>
                    Export CSV
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                    <span className="material-symbols-outlined">filter_list</span>
                    Filters:
                </div>

                <select
                    name="course_id"
                    value={filters.course_id}
                    onChange={handleFilterChange}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="">All Courses</option>
                    {courses.map(course => (
                        <option key={course.id} value={course.id}>{course.code} - {course.name}</option>
                    ))}
                </select>

                <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="">All Statuses</option>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                </select>

                <input
                    type="date"
                    name="date"
                    value={filters.date}
                    onChange={handleFilterChange}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                {(filters.course_id || filters.date || filters.status) && (
                    <button
                        onClick={() => setFilters({ course_id: '', date: '', status: '' })}
                        className="text-xs font-bold text-rose-500 hover:text-rose-600"
                    >
                        Clear Filters
                    </button>
                )}
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs text-slate-400 border-b border-slate-50 uppercase tracking-widest font-black bg-slate-50/50">
                                    <th className="py-4 pl-6 font-black">Student</th>
                                    <th className="py-4 font-black">Course</th>
                                    <th className="py-4 font-black">Date & Time</th>
                                    <th className="py-4 font-black">Status</th>
                                    <th className="py-4 pr-6 font-black text-right">Method</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm font-medium text-slate-600">
                                {attendance.map(record => (
                                    <tr key={record.id} className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0">
                                        <td className="py-4 pl-6">
                                            <div className="font-bold text-slate-800">{record.student?.name || 'Unknown'}</div>
                                            <div className="text-[10px] text-slate-400 font-mono">{record.student?.student_id}</div>
                                        </td>
                                        <td className="py-4">
                                            <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-xs font-bold">
                                                {record.course?.code || '-'}
                                            </span>
                                        </td>
                                        <td className="py-4">
                                            <div className="text-slate-700">{new Date(record.detected_at).toLocaleDateString()}</div>
                                            <div className="text-xs text-slate-400">{new Date(record.detected_at).toLocaleTimeString()}</div>
                                        </td>
                                        <td className="py-4">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border 
                                                ${record.status === 'present' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                    record.status === 'late' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                        'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full 
                                                    ${record.status === 'present' ? 'bg-emerald-500' :
                                                        record.status === 'late' ? 'bg-amber-500' :
                                                            'bg-rose-500'}`}></span>
                                                {record.status}
                                            </span>
                                        </td>
                                        <td className="py-4 pr-6 text-right">
                                            <span className="text-xs text-slate-400 capitalize">{record.method}</span>
                                        </td>
                                    </tr>
                                ))}
                                {attendance.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="py-12 text-center text-slate-400 font-medium">
                                            No attendance records found matching your filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AttendancePage;
