import React, { useState, useEffect, useRef } from 'react';
import FaceEnrollmentStudio from '../components/Registration/FaceEnrollmentStudio';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

const StudentRegister = () => {
    const navigate = useNavigate();
    const [isScanning, setIsScanning] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        student_id: '',
        email: '',
        password: '',
        mobile: '',
        gender: '',
        dob: '',
        college: 'socmacs',
        department: '',
        course: '',
        semester: '',
        division: '',
        academic_year: '',
        consent_given: false
    });
    const [faceDescriptors, setFaceDescriptors] = useState([]);
    const [capturedImage, setCapturedImage] = useState(null);
    const [activeSection, setActiveSection] = useState('basic-identity');
    const [progress, setProgress] = useState(0);

    const mainContentRef = useRef(null);

    const sections = [
        { id: 'basic-identity', label: 'Identity & Security', icon: 'person' },
        { id: 'academic-info', label: 'Academic Details', icon: 'school' },
        { id: 'face-enrollment', label: 'Biometric Scan', icon: 'photo_camera' },
        { id: 'consent', label: 'Declaration', icon: 'verified_user' }
    ];

    useEffect(() => {
        const requiredFields = ['name', 'student_id', 'email', 'password', 'mobile', 'gender', 'dob', 'college', 'department', 'course', 'semester', 'division', 'academic_year'];

        const completedCount = requiredFields.filter(f => formData[f]).length;
        const faceComplete = faceDescriptors.length > 0 ? 1 : 0;
        const consentComplete = formData.consent_given ? 1 : 0;

        const formProgress = (completedCount / requiredFields.length) * 60;
        const faceProgress = faceComplete * 30;
        const consentProgress = consentComplete * 10;

        setProgress(formProgress + faceProgress + consentProgress);
    }, [formData, faceDescriptors]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleFaceCaptureComplete = ({ descriptors, image }) => {
        setFaceDescriptors(descriptors);
        setCapturedImage(image);
        setIsScanning(false);
    };

    const handleSubmit = async () => {
        if (!formData.consent_given) return alert("Please Provide Consent");
        if (faceDescriptors.length === 0) return alert("Please complete Face Scan");
        if (formData.password.length < 8) return alert("Password must be at least 8 characters");

        try {
            const payload = {
                ...formData,
                face_descriptor: faceDescriptors[0]
            };
            const response = await api.post('/students', payload);
            // Redirect to success page with student data
            navigate('/registration-success', {
                state: {
                    student: {
                        name: formData.name,
                        student_id: formData.student_id,
                        department: formData.department,
                        academic_year: formData.academic_year,
                        profile_image: capturedImage
                    }
                }
            });
        } catch (error) {
            console.error("Submission Error:", error.response?.data);
            const errorMsg = error.response?.data?.message || error.message;
            const validationErrors = error.response?.data?.errors;

            if (validationErrors) {
                const detailedErrors = Object.values(validationErrors).flat().join('\n');
                alert(`Registration Failed:\n${detailedErrors}`);
            } else {
                alert(`Registration Failed: ${errorMsg}`);
            }
        }
    };

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setActiveSection(id);
        }
    };

    return (
        <div className="flex min-h-screen font-display bg-background-light text-slate-900 antialiased">
            {/* Sidebar Navigation - Responsive Hidden */}
            <aside className="w-72 bg-white border-r border-slate-200 fixed h-full hidden lg:flex flex-col z-40">
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="bg-primary text-white p-2 rounded-lg">
                            <span className="material-symbols-outlined">face_unlock</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold leading-none text-slate-900">EduGate</h1>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">Registration v2.6</p>
                        </div>
                    </div>
                    <nav className="space-y-1">
                        {sections.map(section => (
                            <button
                                key={section.id}
                                onClick={() => scrollToSection(section.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${activeSection === section.id
                                    ? 'sidebar-item-active text-primary'
                                    : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                <span className="material-symbols-outlined">{section.icon}</span>
                                {section.label}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="mt-auto p-8">
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 text-center">Form Health</p>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div className="bg-primary h-full transition-all duration-700 ease-out" style={{ width: `${progress}%` }}></div>
                        </div>
                        <p className="text-[10px] mt-2 text-slate-500 font-bold text-center">{Math.round(progress)}% COMPLETED</p>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-72 pb-32 relative overflow-y-auto w-full transition-all duration-500" ref={mainContentRef}>
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-4 flex justify-between items-center w-full">
                    <div>
                        <h2 className="text-lg sm:text-xl font-black tracking-tight text-slate-800">Student Enrollment</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest hidden sm:block">Academic Session 2026-27</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to="/login" className="flex items-center gap-2 text-primary font-black uppercase tracking-tighter text-xs px-4 py-2 bg-primary/5 rounded-xl hover:bg-primary/10 transition-all">
                            <span className="material-symbols-outlined text-sm">login</span> Login
                        </Link>
                    </div>
                </header>

                <div className="max-w-4xl mx-auto px-4 sm:px-10 py-10 space-y-16">
                    {/* Section 1: Basic Identity & Security */}
                    <section id="basic-identity" className="scroll-mt-24 animate-in fade-in slide-in-from-bottom-6 duration-700">
                        <div className="mb-8">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Identity & Security</h3>
                            <p className="text-slate-500 mt-1 font-medium text-sm sm:text-base">Provide your legal identification and set a secure password for your student portal.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-6 sm:p-10 rounded-[32px] border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:shadow-primary/5">
                            <div className="space-y-2 sm:col-span-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Legal Name</label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 rounded-2xl border-slate-100 bg-slate-50 text-slate-900 font-bold focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none placeholder:text-slate-300"
                                    placeholder="Enter your full name"
                                    type="text"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Institutional ID</label>
                                <input
                                    name="student_id"
                                    value={formData.student_id}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 rounded-2xl border-slate-100 bg-slate-50 text-slate-900 font-bold focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none placeholder:text-slate-300"
                                    placeholder="STU-2026-XXXX"
                                    type="text"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Email</label>
                                <input
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 rounded-2xl border-slate-100 bg-slate-50 text-slate-900 font-bold focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none placeholder:text-slate-300"
                                    placeholder="student@institution.edu"
                                    type="email"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Password</label>
                                <input
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 rounded-2xl border-slate-100 bg-slate-50 text-slate-900 font-bold focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none placeholder:text-slate-300"
                                    placeholder="Min. 8 characters"
                                    type="password"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Mobile Number</label>
                                <input
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 rounded-2xl border-slate-100 bg-slate-50 text-slate-900 font-bold focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none placeholder:text-slate-300"
                                    placeholder="+91 XXXXX XXXXX"
                                    type="tel"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Date of Birth</label>
                                <input
                                    name="dob"
                                    value={formData.dob}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 rounded-2xl border-slate-100 bg-slate-50 text-slate-900 font-bold focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                                    type="date"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 rounded-2xl border-slate-100 bg-slate-50 text-slate-900 font-bold focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Academic Details */}
                    <section id="academic-info" className="scroll-mt-24 animate-in fade-in slide-in-from-bottom-6 duration-700">
                        <div className="mb-8">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Academic Profile</h3>
                            <p className="text-slate-500 mt-1 font-medium text-sm sm:text-base">Your enrollment details are restricted to your current institutional assignment.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-6 sm:p-10 rounded-[32px] border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:shadow-primary/5">
                            <div className="space-y-2 sm:col-span-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Educational College</label>
                                <select
                                    name="college"
                                    value={formData.college}
                                    onChange={handleChange}
                                    disabled={true}
                                    className="w-full px-5 py-4 rounded-2xl border-slate-100 bg-slate-50 text-slate-900 font-bold focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none opacity-80"
                                >
                                    <option value="socmacs">SOCMACS College</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Branch / Department</label>
                                <select
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 rounded-2xl border-slate-100 bg-slate-50 text-slate-900 font-bold focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                                >
                                    <option value="">Select Branch</option>
                                    <option value="BCA">BCA (Comp. Applications)</option>
                                    <option value="BBA">BBA (Business Admin)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Degree Course</label>
                                <input
                                    name="course"
                                    value={formData.course}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 rounded-2xl border-slate-100 bg-slate-50 text-slate-900 font-bold focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                                    placeholder="e.g. Science / Arts"
                                    type="text"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Academic Year</label>
                                <select
                                    name="academic_year"
                                    value={formData.academic_year}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 rounded-2xl border-slate-100 bg-slate-50 text-slate-900 font-bold focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                                >
                                    <option value="">Select Year</option>
                                    <option value="1st Year">1st Year</option>
                                    <option value="2nd Year">2nd Year</option>
                                    <option value="3rd Year">3rd Year</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Semester</label>
                                <select
                                    name="semester"
                                    value={formData.semester}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 rounded-2xl border-slate-100 bg-slate-50 text-slate-900 font-bold focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                                >
                                    <option value="">Select Semester</option>
                                    <option value="Semester 1">Semester 1</option>
                                    <option value="Semester 2">Semester 2</option>
                                    <option value="Semester 3">Semester 3</option>
                                    <option value="Semester 4">Semester 4</option>
                                    <option value="Semester 5">Semester 5</option>
                                    <option value="Semester 6">Semester 6</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Section / Division</label>
                                <input
                                    name="division"
                                    value={formData.division}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 rounded-2xl border-slate-100 bg-slate-50 text-slate-900 font-bold focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                                    placeholder="e.g. A, B, or C"
                                    type="text"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Face Enrollment Module */}
                    <section id="face-enrollment" className="scroll-mt-24 animate-in fade-in slide-in-from-bottom-6 duration-700">
                        <div className="mb-8">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Biometric Registration</h3>
                            <p className="text-slate-500 mt-1 font-medium text-sm sm:text-base">Complete the automated scanning process. Ensure high illumination for best results.</p>
                        </div>
                        <div className="bg-white p-6 sm:p-10 rounded-[40px] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-10 relative overflow-hidden transition-all hover:shadow-xl hover:shadow-primary/5">
                            <div className="flex-1 space-y-6">
                                <div className="relative rounded-3xl overflow-hidden shadow-inner bg-slate-900 h-[240px] sm:h-[320px]">
                                    <FaceEnrollmentStudio
                                        isScanning={isScanning}
                                        onCaptureComplete={handleFaceCaptureComplete}
                                    />

                                    {!isScanning && faceDescriptors.length === 0 && (
                                        <div className="absolute inset-0 z-10 bg-slate-900/10 backdrop-blur-[4px] flex flex-col items-center justify-center p-6 text-center rounded-3xl">
                                            <div className="bg-white/95 p-8 rounded-[32px] shadow-2xl border border-white max-w-[240px] animate-in zoom-in duration-300">
                                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                                    <span className="material-symbols-outlined text-3xl text-primary">photo_camera</span>
                                                </div>
                                                <h4 className="font-black text-slate-900 mb-2 text-sm uppercase tracking-tight">Camera Ready</h4>
                                                <p className="text-[10px] text-slate-500 font-bold leading-relaxed">Start biometric capture for secure institutional identification.</p>
                                            </div>
                                        </div>
                                    )}

                                    {faceDescriptors.length > 0 && !isScanning && (
                                        <div className="absolute top-6 right-6 z-20 animate-in slide-in-from-right-4">
                                            <div className="bg-emerald-500 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2.5 shadow-xl shadow-emerald-500/20 border border-emerald-400">
                                                <span className="material-symbols-outlined text-base">verified</span> CAPTURE SUCCESS
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => setIsScanning(true)}
                                    disabled={isScanning}
                                    className="w-full bg-primary hover:bg-primary/95 disabled:bg-slate-100 disabled:text-slate-300 text-white font-black uppercase tracking-widest py-5 rounded-2xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3 group"
                                >
                                    <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">photo_camera</span>
                                    {isScanning ? 'ENROLLING FACE...' : faceDescriptors.length > 0 ? 'RETRY SCAN SEQUENCE' : 'START SCAN SEQUENCE'}
                                </button>
                            </div>

                            <div className="w-full md:w-64 space-y-8">
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-center md:text-left">Scan Protocols</p>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-5 group">
                                        <div className={`w-14 h-14 rounded-2xl transition-all duration-500 ${faceDescriptors.length > 0 ? 'bg-emerald-100 text-emerald-600 rotate-0 shadow-lg shadow-emerald-100' : 'bg-slate-50 text-slate-300 -rotate-3'} flex items-center justify-center`}>
                                            <span className="material-symbols-outlined text-2xl">{faceDescriptors.length > 0 ? 'verified' : 'face'}</span>
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-tight">Facial Alignment</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Center Frame Focus</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5 group">
                                        <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-300 rotate-6 flex items-center justify-center transition-all group-hover:rotate-0">
                                            <span className="material-symbols-outlined text-2xl">light_mode</span>
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-tight">Ambient Light</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Neutral Exposure</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-blue-50/50 p-6 rounded-[28px] border border-blue-100/50">
                                    <h4 className="text-[10px] font-black text-blue-800 mb-2 flex items-center gap-2 uppercase tracking-widest">
                                        <span className="material-symbols-outlined text-sm">security_update_good</span> Data Privacy
                                    </h4>
                                    <p className="text-[10px] text-blue-700/80 leading-relaxed font-bold uppercase tracking-tighter">
                                        All facial vectors are encrypted on-device before institutional transfer. Raw pixels are not stored.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 4: Consent & Declaration */}
                    <section id="consent" className="scroll-mt-24 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
                        <div className="mb-8">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Declaration</h3>
                            <p className="text-slate-500 mt-1 font-medium text-sm sm:text-base">Review the data processing agreement and authorize your enrollment.</p>
                        </div>
                        <div className="bg-white p-6 sm:p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
                            <div className="p-6 bg-slate-50 rounded-3xl text-[11px] sm:text-xs text-slate-500 max-h-48 overflow-y-auto border border-slate-100 leading-relaxed font-bold uppercase tracking-tight custom-scrollbar">
                                <p className="font-black mb-2 text-slate-800">Biometric Standards Agreement</p>
                                <p className="mb-4">By initiating the EduGate enrollment, I authorize the institution to transform my facial topology into a mathematically unique vector. This vector is exclusively used for attendance authentication and access control within the university campus.</p>
                                <p className="mb-4">I understand that my biometric identity is encrypted under AES-256 standards and protected by institutional cybersecurity protocols. I retain the right to request vector deletion upon academic completion.</p>
                                <p>This agreement aligns with global GDPR and Digital Personal Data Protection standards.</p>
                            </div>
                            <div className={`flex items-start gap-4 p-6 rounded-3xl border transition-all duration-300 ${formData.consent_given ? 'bg-primary/5 border-primary/20' : 'bg-slate-50 border-slate-100 hover:border-primary/20'}`}>
                                <div className="pt-1">
                                    <input
                                        id="consent-check"
                                        name="consent_given"
                                        type="checkbox"
                                        checked={formData.consent_given}
                                        onChange={handleChange}
                                        className="w-6 h-6 rounded-lg border-slate-300 text-primary focus:ring-primary focus:ring-offset-background transition-all"
                                    />
                                </div>
                                <label className="text-xs sm:text-sm font-black text-slate-700 flex-1 cursor-pointer leading-tight uppercase tracking-tighter" htmlFor="consent-check">
                                    I acknowledge the institutional biometric protocols and certify that all details provided are accurate.
                                </label>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            {/* Sticky Bottom Action Bar - Mobile Optimized */}
            <footer className="fixed bottom-0 left-0 right-0 lg:left-72 bg-white/95 backdrop-blur-md border-t border-slate-100 px-4 sm:px-8 py-5 z-40 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-[0_-15px_30px_-5px_rgba(0,0,0,0.05)] animate-in slide-in-from-bottom-full duration-500">
                <div className="hidden md:flex items-center gap-4 text-slate-300">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-xl">shield_locked</span>
                    </div>
                    <p className="text-[10px] max-w-[140px] leading-tight font-black uppercase tracking-tighter">SECURE E2E ENCRYPTED SUBMISSION</p>
                </div>
                <div className="flex gap-4 w-full sm:w-auto">
                    <button
                        onClick={() => navigate('/login')}
                        className="flex-1 sm:flex-none px-6 py-4 font-black uppercase tracking-widest text-xs text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-2xl transition-all border border-transparent hover:border-slate-100"
                    >
                        Save Draft
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!formData.consent_given || faceDescriptors.length === 0}
                        className="flex-1 sm:flex-none bg-primary hover:bg-primary/95 disabled:bg-slate-100 disabled:text-slate-300 text-white font-black uppercase tracking-[0.15em] text-xs px-12 py-4 rounded-2xl shadow-2xl shadow-primary/30 transition-all flex items-center justify-center gap-3 group"
                    >
                        COMPLETE REGISTRATION
                        <span className="material-symbols-outlined text-lg group-hover:translate-x-1.5 transition-transform">send</span>
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default StudentRegister;
