import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentFormModal = ({ isOpen, onClose, onSave, student = null }) => {
    const [formData, setFormData] = useState({
        name: '',
        student_id: '',
        email: '',
        mobile: '',
        gender: 'Male',
        dob: '',
        college: '',
        department: '',
        course: '',
        semester: '',
        division: '',
        academic_year: '',
        password: 'password123', // Default password for admin creation
        consent_given: true
    });

    useEffect(() => {
        if (student) {
            setFormData({ ...student, password: '' });
        } else {
            setFormData({
                name: '',
                student_id: '',
                email: '',
                mobile: '',
                gender: 'Male',
                dob: '',
                college: '',
                department: '',
                course: '',
                semester: '',
                division: '',
                academic_year: '',
                password: 'password123',
                consent_given: true
            });
        }
    }, [student, isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const url = student
                ? `http://127.0.0.1:8000/api/students/${student.id}`
                : 'http://127.0.0.1:8000/api/students';

            const method = student ? 'put' : 'post';

            // For now, mock face_descriptor for admin creation if not present
            const payload = {
                ...formData,
                face_descriptor: student?.face_descriptor || []
            };

            const response = await axios({
                method,
                url,
                data: payload,
                headers: { Authorization: `Bearer ${token}` }
            });

            onSave(response.data);
            onClose();
        } catch (error) {
            console.error('Error saving student:', error);
            alert('Failed to save student: ' + (error.response?.data?.message || error.message));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-black text-slate-800">{student ? 'Edit Student' : 'Add New Student'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Personal Info */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Personal Info</h3>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                                <input name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Mobile</label>
                                <input name="mobile" value={formData.mobile} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Gender</label>
                                    <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Date of Birth</label>
                                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} required className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>
                            </div>
                        </div>

                        {/* Academic Info */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Academic Info</h3>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Student ID (Roll No)</label>
                                <input name="student_id" value={formData.student_id} onChange={handleChange} required className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">College</label>
                                <input name="college" value={formData.college} onChange={handleChange} required className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Department</label>
                                    <input name="department" value={formData.department} onChange={handleChange} required className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Course</label>
                                    <input name="course" value={formData.course} onChange={handleChange} required className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Sem</label>
                                    <input name="semester" value={formData.semester} onChange={handleChange} required className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Div</label>
                                    <input name="division" value={formData.division} onChange={handleChange} required className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Year</label>
                                    <input name="academic_year" value={formData.academic_year} onChange={handleChange} required className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="px-6 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                            {student ? 'Save Changes' : 'Create Student'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StudentFormModal;
