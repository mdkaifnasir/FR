import React, { useState, useEffect, useRef } from 'react';
import FaceEnrollmentStudio from '../components/Registration/FaceEnrollmentStudio';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

const StudentRegister = () => {
    const navigate = useNavigate();
    const [isScanning, setIsScanning] = useState(false);
    const [formData, setFormData] = useState({
        name: '', student_id: '', email: '', mobile: '', gender: '', dob: '',
        faculty: '', degree: '', year: '', semester: '',
        consent_given: false
    });
    const [faceDescriptors, setFaceDescriptors] = useState([]);
    const [activeSection, setActiveSection] = useState('basic-identity');
    const [progress, setProgress] = useState(0);

    const mainContentRef = useRef(null);

    const sections = [
        { id: 'basic-identity', label: 'Basic Identity', icon: 'person' },
        { id: 'academic-info', label: 'Academic Info', icon: 'school' },
        { id: 'face-enrollment', label: 'Face Enrollment', icon: 'photo_camera' },
        { id: 'consent', label: 'Consent & Declaration', icon: 'verified_user' }
    ];

    useEffect(() => {
        // Calculate progress based on filled fields
        const identityFields = ['name', 'student_id', 'email', 'gender', 'dob'];
        const academicFields = ['faculty', 'degree', 'year', 'semester'];

        let completed = 0;
        if (identityFields.every(f => formData[f])) completed++;
        if (academicFields.every(f => formData[f])) completed++;
        if (faceDescriptors.length > 0) completed++;
        if (formData.consent_given) completed++;

        setProgress((completed / 4) * 100);
    }, [formData, faceDescriptors]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleFaceCaptureComplete = (descriptors) => {
        setFaceDescriptors(descriptors);
        setIsScanning(false);
    };

    const handleSubmit = async () => {
        if (!formData.consent_given) return alert("Please Provide Consent");
        if (faceDescriptors.length === 0) return alert("Please complete Face Scan");

        try {
            const payload = {
                ...formData,
                face_descriptor: Array.from(faceDescriptors[0])
            };
            await api.post('/students', payload);
            alert("Registration Successful!");
            navigate('/login');
        } catch (error) {
            alert("Registration Failed: " + (error.response?.data?.message || error.message));
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
        <div className="flex min-h-screen font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased">
            {/* Sidebar Navigation */}
            <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 fixed h-full hidden lg:flex flex-col z-40">
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="bg-primary text-white p-2 rounded-lg">
                            <span className="material-symbols-outlined">face_unlock</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold leading-none">EduGate</h1>
                            <p className="text-xs text-slate-500 font-medium">Registration Portal v2.4</p>
                        </div>
                    </div>
                    <nav className="space-y-1">
                        {sections.map(section => (
                            <button
                                key={section.id}
                                onClick={() => scrollToSection(section.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg transition-all ${activeSection === section.id
                                        ? 'sidebar-item-active text-primary'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <span className="material-symbols-outlined">{section.icon}</span>
                                {section.label}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="mt-auto p-8">
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200/50 dark:border-slate-700">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Completion</p>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                            <div className="bg-primary h-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                        </div>
                        <p className="text-xs mt-2 text-slate-500">{Math.round((progress / 100) * 4)} of 4 sections completed</p>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-72 pb-24 relative overflow-y-auto" ref={mainContentRef}>
                <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold tracking-tight">Student Registration</h2>
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-semibold px-3 py-1 bg-amber-100/50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full border border-amber-200/50 dark:border-amber-800/50">Draft Autosaved</span>
                        <button className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined">help_outline</span>
                        </button>
                    </div>
                </header>

                <div className="max-w-4xl mx-auto px-8 py-10 space-y-12">
                    {/* Section 1: Basic Identity */}
                    <section id="basic-identity" className="scroll-mt-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Basic Identity</h3>
                            <p className="text-slate-500 mt-1">Provide your legal identification details as they appear on your passport or ID card.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                            <div className="space-y-2 col-span-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                                    placeholder="Johnathan Doe"
                                    type="text"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Student ID Number</label>
                                <input
                                    name="student_id"
                                    value={formData.student_id}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                                    placeholder="STU-2024-001"
                                    type="text"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Date of Birth</label>
                                <input
                                    name="dob"
                                    value={formData.dob}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                                    type="date"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Contact Email</label>
                                <input
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                                    placeholder="j.doe@university.edu"
                                    type="email"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Academic Information */}
                    <section id="academic-info" className="scroll-mt-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Academic Information</h3>
                            <p className="text-slate-500 mt-1">Specify your current enrollment details within the university.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Faculty / Department</label>
                                <select
                                    name="faculty"
                                    value={formData.faculty}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                                >
                                    <option value="">Select Faculty</option>
                                    <option value="Engineering">Engineering & Technology</option>
                                    <option value="Business">Business School</option>
                                    <option value="Arts">Faculty of Arts</option>
                                    <option value="Medicine">Medical Sciences</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Degree Program</label>
                                <input
                                    name="degree"
                                    value={formData.degree}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                                    placeholder="B.Sc. Computer Science"
                                    type="text"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Year of Study</label>
                                <select
                                    name="year"
                                    value={formData.year}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                                >
                                    <option value="">Select Year</option>
                                    <option value="Year 1">Year 1</option>
                                    <option value="Year 2">Year 2</option>
                                    <option value="Year 3">Year 3</option>
                                    <option value="Year 4">Year 4</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Current Semester</label>
                                <select
                                    name="semester"
                                    value={formData.semester}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                                >
                                    <option value="">Select Semester</option>
                                    <option value="Semester 1">Semester 1</option>
                                    <option value="Semester 2">Semester 2</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Face Enrollment Module */}
                    <section id="face-enrollment" className="scroll-mt-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Face Enrollment</h3>
                            <p className="text-slate-500 mt-1">Complete biometric capture for automated attendance. Ensure you are in a well-lit area without glasses or headwear.</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-8">
                            {/* Camera Feed Container */}
                            <div className="flex-1 space-y-4">
                                <div className="camera-feed aspect-video rounded-xl relative overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-700">
                                    <FaceEnrollmentStudio
                                        isScanning={isScanning}
                                        onCaptureComplete={handleFaceCaptureComplete}
                                    />

                                    {!isScanning && faceDescriptors.length === 0 && (
                                        <div className="absolute inset-0 z-10 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center p-6 text-center">
                                            <div className="bg-white/90 dark:bg-slate-900/90 p-6 rounded-2xl shadow-xl border border-white/20">
                                                <span className="material-symbols-outlined text-4xl text-primary mb-3">photo_camera</span>
                                                <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-sm">Action Required</h4>
                                                <p className="text-xs text-slate-600 dark:text-slate-400">Click below to start your face enrollment sequence.</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Success Indicators */}
                                    {faceDescriptors.length > 0 && !isScanning && (
                                        <div className="absolute bottom-4 left-4 right-4 flex justify-between z-20">
                                            <div className="flex gap-2">
                                                <div className="bg-emerald-500/90 backdrop-blur px-2 py-1 rounded text-[10px] text-white font-bold flex items-center gap-1 shadow-lg">
                                                    <span className="material-symbols-outlined text-xs">check_circle</span> FACE CAPTURED
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => setIsScanning(true)}
                                    disabled={isScanning}
                                    className="w-full bg-primary hover:bg-primary/90 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 group"
                                >
                                    <span className="material-symbols-outlined group-hover:scale-110 transition-transform">photo_camera</span>
                                    {isScanning ? 'Capturing Face Data...' : faceDescriptors.length > 0 ? 'Restart Capture Sequence' : 'Start Capture Sequence'}
                                </button>
                            </div>
                            {/* Pose Guides Sidebar */}
                            <div className="w-full md:w-64 space-y-6">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Enrollment Tips</p>
                                <div className="space-y-4">
                                    <div className={`flex items-center gap-4 transition-opacity ${faceDescriptors.length > 0 ? 'opacity-100' : 'opacity-100'}`}>
                                        <div className={`w-12 h-12 rounded-lg ${faceDescriptors.length > 0 ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' : 'bg-primary/10 text-primary'} flex items-center justify-center`}>
                                            <span className="material-symbols-outlined">{faceDescriptors.length > 0 ? 'check_circle' : 'face'}</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold leading-none">Look Straight</p>
                                            <p className="text-[11px] text-slate-500">Center align face</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 opacity-100">
                                        <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                            <span className="material-symbols-outlined">light_mode</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold leading-none">Good Lighting</p>
                                            <p className="text-[11px] text-slate-500">Avoid shadows</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-blue-50 dark:bg-slate-800/50 p-4 rounded-xl border border-blue-100 dark:border-slate-800">
                                    <h4 className="text-xs font-bold text-blue-800 dark:text-blue-300 mb-1 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">info</span> TIP
                                    </h4>
                                    <p className="text-[11px] text-blue-700 dark:text-blue-400 leading-relaxed">
                                        Remove glasses and masks. Ensure no other faces are visible in the frame for accurate detection.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 4: Consent & Declaration */}
                    <section id="consent" className="scroll-mt-24 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Consent & Declaration</h3>
                            <p className="text-slate-500 mt-1">Please review the data privacy policy and provide your acknowledgement.</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                            <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm text-slate-600 dark:text-slate-400 max-h-48 overflow-y-auto border border-slate-100 dark:border-slate-800 leading-relaxed custom-scrollbar">
                                <p className="font-bold mb-2 text-slate-900 dark:text-slate-200">Biometric Data Processing Agreement</p>
                                <p className="mb-4">By enrolling in the EduGate face-recognition system, I voluntarily consent to the collection and processing of my biometric data (facial features) for the sole purpose of student identification and attendance tracking. This data will be securely stored in an encrypted format and will not be shared with third parties without prior authorization.</p>
                                <p className="mb-4">I understand that I have the right to revoke this consent at any time through the University Registrar's office, which may require transition to alternative identification methods.</p>
                                <p>All data processing complies with the General Data Protection Regulation (GDPR) and University Privacy Standards.</p>
                            </div>
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 transition-all hover:border-primary/30">
                                <div className="pt-0.5">
                                    <input
                                        id="consent-check"
                                        name="consent_given"
                                        type="checkbox"
                                        checked={formData.consent_given}
                                        onChange={handleChange}
                                        className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary focus:ring-offset-background transition-all"
                                    />
                                </div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex-1 cursor-pointer" htmlFor="consent-check">
                                    I have read the biometric data processing agreement and confirm that all information provided is accurate and complete.
                                </label>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            {/* Sticky Bottom Action Bar */}
            <footer className="fixed bottom-0 left-0 right-0 lg:left-72 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-t border-slate-200 dark:border-slate-800 px-8 py-4 z-50 flex justify-between items-center shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)] animate-in slide-in-from-bottom-full duration-500">
                <div className="hidden sm:flex items-center gap-4 text-slate-500">
                    <span className="material-symbols-outlined text-primary">security</span>
                    <p className="text-[10px] max-w-[180px] leading-tight font-bold uppercase tracking-tight">End-to-End Encrypted Secure Submission</p>
                </div>
                <div className="flex gap-4 w-full sm:w-auto">
                    <button
                        onClick={() => navigate('/login')}
                        className="flex-1 sm:flex-none px-6 py-3 font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                    >
                        Save Draft
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!formData.consent_given || faceDescriptors.length === 0}
                        className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 group"
                    >
                        Submit Registration
                        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default StudentRegister;
