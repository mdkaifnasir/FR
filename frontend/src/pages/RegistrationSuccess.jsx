import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const RegistrationSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const studentData = location.state?.student || {
        name: "Student Name",
        student_id: "ID-PENDING",
        department: "Department",
        academic_year: "Year"
    };

    return (
        <div className="bg-background-light font-display text-slate-800 min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="campus-pattern opacity-5 absolute inset-0"></div>
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
            </div>

            <main className="relative z-10 w-full max-w-2xl animate-in fade-in zoom-in duration-500">
                {/* Success Header Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-100 mb-6 border-4 border-white shadow-xl">
                        <span className="material-symbols-outlined text-emerald-500 text-5xl fill-1">check_circle</span>
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">Registration Complete!</h1>
                    <p className="text-slate-600 max-w-md mx-auto">
                        Welcome to the Face-Recognition Attendance System. Your profile is now active and ready for use.
                    </p>
                </div>

                {/* Summary Card */}
                <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden mb-8">
                    <div className="h-2 bg-primary w-full"></div>
                    <div className="p-8">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            {/* Profile Placeholder */}
                            <div className="relative">
                                <div className="w-32 h-32 rounded-2xl bg-slate-100 overflow-hidden border-2 border-slate-100">
                                    <img
                                        alt="Student Portrait"
                                        className="w-full h-full object-cover"
                                        src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
                                    />
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white rounded-full p-1.5 border-4 border-white shadow-lg shadow-emerald-200">
                                    <span className="material-symbols-outlined text-sm font-bold">verified_user</span>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="flex-1 text-center md:text-left">
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest mb-3 border border-emerald-100">
                                    <span className="material-symbols-outlined text-xs mr-1.5">security</span>
                                    FACE DATA ENCRYPTED
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-1">{studentData.name}</h2>
                                <p className="text-slate-500 text-sm mb-4">Roll Number: <span className="font-mono font-bold text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{studentData.student_id}</span></p>

                                <div className="grid grid-cols-2 gap-4 text-sm mt-6">
                                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                        <span className="block text-slate-400 text-[10px] font-black uppercase tracking-wider mb-0.5">Department</span>
                                        <span className="font-bold text-slate-800">{studentData.department}</span>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                        <span className="block text-slate-400 text-[10px] font-black uppercase tracking-wider mb-0.5">Year</span>
                                        <span className="font-bold text-slate-800">{studentData.academic_year}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Privacy/Security Notice */}
                        <div className="mt-8 p-5 bg-primary/5 rounded-2xl border border-primary/10 flex items-start gap-4 transition-all hover:bg-primary/10">
                            <span className="material-symbols-outlined text-primary mt-0.5">verified</span>
                            <div>
                                <h4 className="text-xs font-black text-primary mb-1 uppercase tracking-widest">Privacy & Security Guaranteed</h4>
                                <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                                    Your face embeddings have been securely generated and encrypted using AES-256. For your privacy, all raw source images captured during registration have been permanently destroyed from local storage.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold px-10 py-4 rounded-2xl transition-all shadow-xl shadow-primary/20 group">
                        <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">download</span>
                        Download Enrollment Slip
                    </button>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold px-10 py-4 rounded-2xl border border-slate-200 transition-all"
                    >
                        <span className="material-symbols-outlined text-xl">login</span>
                        Go to Login Portal
                    </button>
                </div>

                {/* Footer Info */}
                <footer className="mt-12 text-center">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                        Face-Recognition Attendance System © 2026 EduGate Institutional Portal. <br />
                        For technical support, contact <span className="text-primary hover:underline cursor-pointer">it-support@edugate.edu</span>
                    </p>
                </footer>
            </main>

            {/* Success Decoration Shapes */}
            <div className="fixed top-20 right-10 opacity-10 pointer-events-none hidden lg:block animate-bounce duration-10000">
                <svg height="100" viewBox="0 0 100 100" width="100">
                    <rect fill="#137fec" height="20" transform="rotate(15)" width="20" x="20" y="20"></rect>
                    <circle cx="70" cy="70" fill="#137fec" r="15"></circle>
                    <path d="M50 10 L60 30 L40 30 Z" fill="#137fec" transform="rotate(-20)"></path>
                </svg>
            </div>
            <div className="fixed bottom-20 left-10 opacity-10 pointer-events-none hidden lg:block animate-pulse">
                <svg height="100" viewBox="0 0 100 100" width="100">
                    <circle cx="30" cy="30" fill="#137fec" r="10"></circle>
                    <rect fill="#137fec" height="15" transform="rotate(45)" width="15" x="60" y="60"></rect>
                    <path d="M20 80 L40 80 L30 60 Z" fill="#137fec"></path>
                </svg>
            </div>
        </div>
    );
};

export default RegistrationSuccess;
