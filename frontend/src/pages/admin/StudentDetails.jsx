import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const StudentDetails = () => {
    const { id } = useParams();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://127.0.0.1:8000/api/students/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStudent(response.data);
            } catch (error) {
                console.error('Error fetching student details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStudent();
    }, [id]);

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (!student) return <div className="p-8 text-center">Student not found</div>;

    return (
        <div>
            <div className="flex items-center gap-4 mb-6">
                <Link to="/students" className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <h1 className="text-2xl font-black text-slate-800">Student Profile</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center">
                    <div className="w-32 h-32 rounded-full bg-slate-100 mb-4 flex items-center justify-center text-4xl font-bold text-slate-400 overflow-hidden relative">
                        {student.face_descriptor ? (
                            <span className="material-symbols-outlined text-6xl text-emerald-500">face</span>
                        ) : (
                            student.name.substring(0, 2)
                        )}
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">{student.name}</h2>
                    <p className="text-slate-500 font-mono text-sm">{student.student_id}</p>

                    <div className="mt-6 w-full space-y-3">
                        <div className="flex justify-between text-sm border-b border-slate-50 pb-2">
                            <span className="text-slate-400">Status</span>
                            <span className={`font-bold ${student.is_active ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {student.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm border-b border-slate-50 pb-2">
                            <span className="text-slate-400">Face Data</span>
                            {student.face_descriptor ? (
                                <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs">
                                    <span className="material-symbols-outlined text-sm">verified_user</span> Registered
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 text-amber-600 font-bold text-xs">
                                    <span className="material-symbols-outlined text-sm">warning</span> Pending
                                </span>
                            )}
                        </div>
                        <div className="flex justify-between text-sm border-b border-slate-50 pb-2">
                            <span className="text-slate-400">Consent</span>
                            <span className="font-bold text-slate-700">{student.consent_given ? 'Yes' : 'No'}</span>
                        </div>
                    </div>

                    <div className="mt-8 w-full flex gap-3">
                        <button className="flex-1 py-2 px-4 bg-slate-800 text-white rounded-xl font-bold text-sm hover:bg-slate-700 transition-colors">
                            Edit Profile
                        </button>
                        <button className="flex-1 py-2 px-4 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors">
                            Re-enroll
                        </button>
                    </div>
                </div>

                {/* Academic & Personal Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                        <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-indigo-500">school</span>
                            Academic Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">College</label>
                                <div className="font-bold text-slate-700">{student.college}</div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Department</label>
                                <div className="font-bold text-slate-700">{student.department}</div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Course</label>
                                <div className="font-bold text-slate-700">{student.course}</div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Semester</label>
                                <div className="font-bold text-slate-700">{student.semester}</div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Division</label>
                                <div className="font-bold text-slate-700">{student.division}</div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Academic Year</label>
                                <div className="font-bold text-slate-700">{student.academic_year}</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                        <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-indigo-500">person</span>
                            Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Email</label>
                                <div className="font-bold text-slate-700">{student.email}</div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Phone</label>
                                <div className="font-bold text-slate-700">{student.mobile}</div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Gender</label>
                                <div className="font-bold text-slate-700">{student.gender}</div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Date of Birth</label>
                                <div className="font-bold text-slate-700">{student.dob}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDetails;
