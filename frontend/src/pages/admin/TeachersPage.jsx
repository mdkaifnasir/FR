import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TeacherFormModal from '../../components/Admin/TeacherFormModal';

const TeachersPage = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://127.0.0.1:8000/api/teachers', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTeachers(response.data);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this teacher? This will delete the user account.')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://127.0.0.1:8000/api/teachers/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTeachers(teachers.filter(teacher => teacher.id !== id));
        } catch (error) {
            console.error('Error deleting teacher:', error);
            alert('Failed to delete teacher');
        }
    };

    const handleSave = (savedTeacher) => {
        if (selectedTeacher) {
            setTeachers(teachers.map(t => t.id === savedTeacher.id ? savedTeacher : t));
        } else {
            setTeachers([...teachers, savedTeacher]);
        }
    };

    const handleEdit = (teacher) => {
        setSelectedTeacher(teacher);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setSelectedTeacher(null);
        setIsModalOpen(true);
    };

    const filteredTeachers = teachers.filter(teacher =>
        teacher.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (teacher.department && teacher.department.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
                <div className="relative flex-1 max-w-md">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                    <input
                        type="text"
                        placeholder="Search teachers..."
                        className="pl-10 pr-4 py-3 bg-white rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 w-full shadow-sm border border-slate-100"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all"
                >
                    <span className="material-symbols-outlined">add</span>
                    Add New Teacher
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs text-slate-400 border-b border-slate-50 uppercase tracking-widest font-black">
                                    <th className="pb-4 pl-4 font-black">Name</th>
                                    <th className="pb-4 font-black">Department</th>
                                    <th className="pb-4 font-black">Specialization</th>
                                    <th className="pb-4 font-black">Status</th>
                                    <th className="pb-4 font-black text-right pr-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm font-medium text-slate-600">
                                {filteredTeachers.map(teacher => (
                                    <tr key={teacher.id} className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0">
                                        <td className="py-4 pl-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold uppercase overflow-hidden">
                                                    {teacher.user.name.substring(0, 2)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-800">{teacher.user.name}</div>
                                                    <div className="text-[10px] text-slate-400 font-mono">{teacher.user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <span className="block font-bold text-slate-700">{teacher.department || '-'}</span>
                                        </td>
                                        <td className="py-4">
                                            <span className="block text-slate-600">{teacher.specialization || '-'}</span>
                                        </td>
                                        <td className="py-4">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${teacher.is_active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${teacher.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                                                {teacher.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right pr-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(teacher)}
                                                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                                                    title="Edit"
                                                >
                                                    <span className="material-symbols-outlined text-lg">edit</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(teacher.id)}
                                                    className="p-2 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors"
                                                    title="Delete"
                                                >
                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredTeachers.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="py-8 text-center text-slate-400 font-medium">
                                            No teachers found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <TeacherFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                teacher={selectedTeacher}
            />
        </div>
    );
};

export default TeachersPage;
