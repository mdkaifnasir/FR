import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TeacherFormModal = ({ isOpen, onClose, onSave, teacher = null }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        department: '',
        specialization: '',
        phone: '',
        is_active: true
    });

    useEffect(() => {
        if (teacher) {
            setFormData({
                name: teacher.user.name,
                email: teacher.user.email,
                password: '', // Leave empty to keep existing
                department: teacher.department,
                specialization: teacher.specialization,
                phone: teacher.phone,
                is_active: teacher.is_active
            });
        } else {
            setFormData({
                name: '',
                email: '',
                password: 'password123', // Default
                department: '',
                specialization: '',
                phone: '',
                is_active: true
            });
        }
    }, [teacher, isOpen]);

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
            const url = teacher
                ? `http://127.0.0.1:8000/api/teachers/${teacher.id}`
                : 'http://127.0.0.1:8000/api/teachers';

            const method = teacher ? 'put' : 'post';

            const response = await axios({
                method,
                url,
                data: formData,
                headers: { Authorization: `Bearer ${token}` }
            });

            onSave(response.data);
            onClose();
        } catch (error) {
            console.error('Error saving teacher:', error);
            alert('Failed to save teacher: ' + (error.response?.data?.message || error.message));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-black text-slate-800">{teacher ? 'Edit Teacher' : 'Add New Teacher'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                            <input name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        {!teacher && (
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
                                <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Department</label>
                            <input name="department" value={formData.department} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Specialization</label>
                            <input name="specialization" value={formData.specialization} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Phone</label>
                            <input name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300" />
                            <label className="text-sm font-bold text-slate-700">Active Status</label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="px-6 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                            {teacher ? 'Save Changes' : 'Create Teacher'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TeacherFormModal;
