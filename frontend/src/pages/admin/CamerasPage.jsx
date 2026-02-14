import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CameraFormModal from '../../components/Admin/CameraFormModal';

const CamerasPage = () => {
    const [cameras, setCameras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCamera, setSelectedCamera] = useState(null);

    useEffect(() => {
        fetchCameras();
    }, []);

    const fetchCameras = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://127.0.0.1:8000/api/cameras', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCameras(response.data);
        } catch (error) {
            console.error('Error fetching cameras:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this camera?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://127.0.0.1:8000/api/cameras/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCameras(cameras.filter(camera => camera.id !== id));
        } catch (error) {
            console.error('Error deleting camera:', error);
            alert('Failed to delete camera');
        }
    };

    const handleSave = (savedCamera) => {
        if (selectedCamera) {
            setCameras(cameras.map(c => c.id === savedCamera.id ? savedCamera : c));
        } else {
            setCameras([...cameras, savedCamera]);
        }
    };

    const handleEdit = (camera) => {
        setSelectedCamera(camera);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setSelectedCamera(null);
        setIsModalOpen(true);
    };

    const filteredCameras = cameras.filter(camera =>
        camera.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        camera.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
                <div className="relative flex-1 max-w-md">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                    <input
                        type="text"
                        placeholder="Search cameras..."
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
                    Add New Camera
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCameras.map(camera => (
                        <div key={camera.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group relative overflow-hidden">
                            {/* Status Indicator Bar */}
                            <div className={`absolute top-0 left-0 w-full h-1 
                                ${camera.status === 'online' ? 'bg-emerald-500' :
                                    camera.status === 'maintenance' ? 'bg-amber-500' : 'bg-rose-500'}`}>
                            </div>

                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 z-10">
                                <button onClick={() => handleEdit(camera)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-500 shadow-sm">
                                    <span className="material-symbols-outlined text-lg">edit</span>
                                </button>
                                <button onClick={() => handleDelete(camera.id)} className="p-2 bg-rose-50 rounded-full hover:bg-rose-100 text-rose-500 shadow-sm">
                                    <span className="material-symbols-outlined text-lg">delete</span>
                                </button>
                            </div>

                            <div className="flex items-start justify-between mb-4 mt-2">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center 
                                    ${camera.status === 'online' ? 'bg-emerald-50 text-emerald-600' :
                                        camera.status === 'maintenance' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
                                    <span className="material-symbols-outlined text-2xl">videocam</span>
                                </div>
                                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border 
                                    ${camera.status === 'online' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                        camera.status === 'maintenance' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                    {camera.status}
                                </span>
                            </div>

                            <h3 className="font-bold text-lg text-slate-800 mb-1">{camera.name}</h3>
                            <div className="flex items-center gap-1 text-xs text-slate-400 font-medium mb-4">
                                <span className="material-symbols-outlined text-sm">location_on</span>
                                {camera.location || 'Unknown Location'}
                            </div>

                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-400 font-bold">RTSP URL</span>
                                    <span className="text-slate-600 font-mono truncate max-w-[120px]">{camera.rtsp_url}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-400 font-bold">Assigned Class</span>
                                    <span className="text-indigo-600 font-bold">{camera.course?.name || 'None'}</span>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                                    <span className="material-symbols-outlined text-sm">history</span>
                                    Last Active: {camera.last_active_at ? new Date(camera.last_active_at).toLocaleString() : 'Never'}
                                </div>
                                <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                                    View Feed <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    ))}
                    {filteredCameras.length === 0 && (
                        <div className="col-span-full py-12 text-center text-slate-400 font-medium">
                            No cameras found.
                        </div>
                    )}
                </div>
            )}

            <CameraFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                camera={selectedCamera}
            />
        </div>
    );
};

export default CamerasPage;
