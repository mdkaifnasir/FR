import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CameraFormModal = ({ isOpen, onClose, onSave, camera = null }) => {
    const [courses, setCourses] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        rtsp_url: '',
        location: '',
        course_id: '',
        status: 'offline'
    });

    useEffect(() => {
        if (isOpen) {
            fetchCourses();
        }
        if (camera) {
            setFormData({
                name: camera.name,
                rtsp_url: camera.rtsp_url,
                location: camera.location || '',
                course_id: camera.course_id || '',
                status: camera.status
            });
        } else {
            setFormData({
                name: '',
                rtsp_url: '',
                location: '',
                course_id: '',
                status: 'offline'
            });
        }
    }, [camera, isOpen]);

    const fetchCourses = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://127.0.0.1:8000/api/courses', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
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
            const url = camera
                ? `http://127.0.0.1:8000/api/cameras/${camera.id}`
                : 'http://127.0.0.1:8000/api/cameras';

            const method = camera ? 'put' : 'post';

            const response = await axios({
                method,
                url,
                data: formData,
                headers: { Authorization: `Bearer ${token}` }
            });

            onSave(response.data);
            onClose();
        } catch (error) {
            console.error('Error saving camera:', error);
            alert('Failed to save camera: ' + (error.response?.data?.message || error.message));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-black text-slate-800">{camera ? 'Edit Camera' : 'Add New Camera'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Camera Name</label>
                            <input name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Classroom 101 Front" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">RTSP Stream URL</label>
                            <input name="rtsp_url" value={formData.rtsp_url} onChange={handleChange} required className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="rtsp://user:pass@ip:port/stream" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Location / Room</label>
                            <input name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Room 101" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Assigned Class (Optional)</label>
                            <select name="course_id" value={formData.course_id} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option value="">None (General Monitoring)</option>
                                {courses.map(course => (
                                    <option key={course.id} value={course.id}>
                                        {course.name} ({course.code})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option value="online">Online</option>
                                <option value="offline">Offline</option>
                                <option value="maintenance">Maintenance</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="px-6 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                            {camera ? 'Save Changes' : 'Add Camera'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CameraFormModal;
