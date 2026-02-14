import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CourseFormModal = ({ isOpen, onClose, onSave, course = null }) => {
    const [teachers, setTeachers] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        teacher_id: '',
        department: '',
        semester: '',
        schedule: [] // Placeholder for now, can be complex later
    });

    useEffect(() => {
        if (isOpen) {
            fetchTeachers();
        }
        if (course) {
            setFormData({
                name: course.name,
                code: course.code,
                teacher_id: course.teacher_id,
                department: course.department || '',
                semester: course.semester || '',
                schedule: course.schedule || []
            });
        } else {
            setFormData({
                name: '',
                code: '',
                teacher_id: '',
                department: '',
                semester: '',
                schedule: []
            });
        }
    }, [course, isOpen]);

    const fetchTeachers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://127.0.0.1:8000/api/teachers', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTeachers(response.data);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const url = course
                ? `http://127.0.0.1:8000/api/courses/${course.id}`
                : 'http://127.0.0.1:8000/api/courses';

            const method = course ? 'put' : 'post';

            const response = await axios({
                method,
                url,
                data: formData,
                headers: { Authorization: `Bearer ${token}` }
            });

            onSave(response.data);
            onClose();
        } catch (error) {
            console.error('Error saving course:', error);
            alert('Failed to save course: ' + (error.response?.data?.message || error.message));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-black text-slate-800">{course ? 'Edit Course' : 'Add New Course'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Course Name</label>
                            <input name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Advanced Mathematics" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Course Code</label>
                            <input name="code" value={formData.code} onChange={handleChange} required className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. MATH101" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Assign Teacher</label>
                            <select name="teacher_id" value={formData.teacher_id} onChange={handleChange} required className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option value="">Select a Teacher</option>
                                {teachers.map(teacher => (
                                    <option key={teacher.id} value={teacher.user.id}>
                                        {teacher.user.name} ({teacher.department})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Department</label>
                                <input name="department" value={formData.department} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Semester</label>
                                <input name="semester" value={formData.semester} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="px-6 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                            {course ? 'Save Changes' : 'Create Course'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CourseFormModal;
