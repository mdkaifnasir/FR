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
        mobile: '',
        gender: '',
        dob: '',
        college: '',
        department: '',
        course: '',
        semester: '',
        division: '',
        academic_year: '',
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
        const requiredFields = ['name', 'student_id', 'email', 'mobile', 'gender', 'dob', 'college', 'department', 'course', 'semester', 'division', 'academic_year'];

        const completedCount = requiredFields.filter(f => formData[f]).length;
        const faceComplete = faceDescriptors.length > 0 ? 1 : 0;
        const consentComplete = formData.consent_given ? 1 : 0;

        // weighting: form (60%), face (30%), consent (10%)
        const formProgress = (completedCount / requiredFields.length) * 60;
        const faceProgress = faceComplete * 30;
        const consentProgress = consentComplete * 10;

        setProgress(formProgress + faceProgress + consentProgress);
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
                face_descriptor: faceDescriptors[0] // Sending the first descriptor (array of floats)
            };
            await api.post('/students', payload);
            alert("Registration Successful!");
            navigate('/login');
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
            {/* Sidebar Navigation */}
            <aside className="w-72 bg-white border-r border-slate-200 fixed h-full hidden lg:flex flex-col z-40">
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="bg-primary text-white p-2 rounded-lg">
                            <span className="material-symbols-outlined">face_unlock</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold leading-none text-slate-900">EduGate</h1>
                            <p className="text-xs text-slate-500 font-medium">Registration Portal v2.5</p>
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
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Completion</p>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div className="bg-primary h-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                        </div>
                        <p className="text-xs mt-2 text-slate-500">{Math.round(progress)}% of total requirements</p>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-72 pb-24 relative overflow-y-auto" ref={mainContentRef}>
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold tracking-tight text-slate-800">Student Registration</h2>
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-semibold px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-100">Draft Autosaved</span>
                        <Link to="/login" className="text-slate-500 hover:text-primary transition-colors flex items-center gap-1 text-sm font-bold">
                            <span className="material-symbols-outlined text-base">login</span> Login
                        </Link>
                    </div>
                </header>

                <div className="max-w-4xl mx-auto px-8 py-10 space-y-12">
                    {/* Section 1: Basic Identity */}
                    <section id="basic-identity" className="scroll-mt-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold text-slate-900">Basic Identity</h3>
                            <p className="text-slate-500 mt-1">Provide your legal identification details as they appear on your institutional records.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
                            <div className="space-y-2 col-span-2">
                                <label className="text-sm font-semibold text-slate-700">Full Name</label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-4 rounded-2xl border-slate-100 bg-slate-50 text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                                    placeholder="Johnathan Doe"
                                    type="text"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Student ID / Roll No</label>
                                <input
                                    name="student_id"
                                    value={formData.student_id}
                                    onChange={handleChange}
                                    className="w-full px-4 py-4 rounded-2xl border-slate-100 bg-slate-50 text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                                    placeholder="STU-2024-001"
                                    type="text"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Contact Email</label>
                                <input
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-4 rounded-2xl border-slate-100 bg-slate-50 text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                                    placeholder="j.doe@university.edu"
                                    type="email"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Mobile Number</label>
                                <input
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    className="w-full px-4 py-4 rounded-2xl border-slate-100 bg-slate-50 text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                                    placeholder="+91 9876543210"
                                    type="tel"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Date of Birth</label>
                                <input
                                    name="dob"
                                    value={formData.dob}
                                    onChange={handleChange}
                                    className="w-full px-4 py-4 rounded-2xl border-slate-100 bg-slate-50 text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                                    type="date"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full px-4 py-4 rounded-2xl border-slate-100 bg-slate-50 text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none font-medium"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Academic Information */}
                    <section id="academic-info" className="scroll-mt-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold text-slate-900">Academic Information</h3>
                            <p className="text-slate-500 mt-1">Specify your current enrollment details within the institution.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
                            <div className="space-y-2 col-span-2">
                                <label className="text-sm font-semibold text-slate-700">Institutional College</label>
                                <select
                                    name="college"
                                    value={formData.college}
                                    onChange={handleChange}
                                    className="w-full px-4 py-4 rounded-2xl border-slate-100 bg-slate-50 text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none font-medium"
                                >
                                    <option value="">Select College</option>
                                    <option value="Abeda Inamdar Senior College">Abeda Inamdar Senior College</option>
                                    <option value="Dr. P.A. Inamdar University">Dr. P.A. Inamdar University</option>
                                    <option value="M.C.E. Society Arts & Commerce">M.C.E. Society Arts & Commerce</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Department / Faculty</label>
                                <select
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    className="w-full px-4 py-4 rounded-2xl border-slate-100 bg-slate-50 text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none font-medium"
                                >
                                    <option value="">Select Department</option>
                                    <option value="Computer Science">Computer Science</option>
                                    <option value="Information Technology">Information Technology</option>
                                    <option value="Arts">General Arts</option>
                                    <option value="Commerce">Commerce & Management</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Course / Degree</label>
                                <input
                                    name="course"
                                    value={formData.course}
                                    onChange={handleChange}
                                    className="w-full px-4 py-4 rounded-2xl border-slate-100 bg-slate-50 text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                                    placeholder="B.Sc. Computer Science"
                                    type="text"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Academic Year</label>
                                <select
                                    name="academic_year"
                                    value={formData.academic_year}
                                    onChange={handleChange}
                                    className="w-full px-4 py-4 rounded-2xl border-slate-100 bg-slate-50 text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none font-medium"
                                >
                                    <option value="">Select Year</option>
                                    <option value="2023-2024">2023-2024</option>
                                    <option value="2024-2025">2024-2025</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Semester</label>
                                <select
                                    name="semester"
                                    value={formData.semester}
                                    onChange={handleChange}
                                    className="w-full px-4 py-4 rounded-2xl border-slate-100 bg-slate-50 text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none font-medium"
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
                                <label className="text-sm font-semibold text-slate-700">Division / Section</label>
                                <input
                                    name="division"
                                    value={formData.division}
                                    onChange={handleChange}
                                    className="w-full px-4 py-4 rounded-2xl border-slate-100 bg-slate-50 text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                                    placeholder="e.g. A, B, or C"
                                    type="text"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Face Enrollment Module */}
                    <section id="face-enrollment" className="scroll-mt-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold text-slate-900">Face Enrollment</h3>
                            <p className="text-slate-500 mt-1">Complete biometric capture for automated attendance. Ensure you are in a well-lit area without glasses or headwear.</p>
                        </div>
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8 relative overflow-hidden">
                            {/* Camera Feed Container */}
                            <div className="flex-1 space-y-4">
                                <div className="relative rounded-2xl overflow-hidden">
                                    <FaceEnrollmentStudio
                                        isScanning={isScanning}
                                        onCaptureComplete={handleFaceCaptureComplete}
                                    />

                                    {!isScanning && faceDescriptors.length === 0 && (
                                        <div className="absolute inset-0 z-10 bg-slate-900/10 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center rounded-2xl">
                                            <div className="bg-white/95 p-6 rounded-3xl shadow-2xl border border-white">
                                                <span className="material-symbols-outlined text-4xl text-primary mb-3">photo_camera</span>
                                                <h4 className="font-bold text-slate-900 mb-2 text-sm">Action Required</h4>
                                                <p className="text-xs text-slate-600">Click below to start your face enrollment sequence.</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Success Indicators - Refined Positioning */}
                                    {faceDescriptors.length > 0 && !isScanning && (
                                        <div className="absolute top-4 right-4 z-20">
                                            <div className="bg-emerald-500 text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-emerald-500/20 border border-emerald-400">
                                                <span className="material-symbols-outlined text-base">verified</span> FACE CAPTURED
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => setIsScanning(true)}
                                    disabled={isScanning}
                                    className="w-full bg-primary hover:bg-primary/90 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 group"
                                >
                                    <span className="material-symbols-outlined group-hover:scale-110 transition-transform">photo_camera</span>
                                    {isScanning ? 'Capturing Biometric Data...' : faceDescriptors.length > 0 ? 'Retry Capture Sequence' : 'Start Capture Sequence'}
                                </button>
                            </div>
                            {/* Pose Guides Sidebar */}
                            <div className="w-full md:w-64 space-y-6">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Enrollment Tips</p>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl transition-colors ${faceDescriptors.length > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'} flex items-center justify-center`}>
                                            <span className="material-symbols-outlined">{faceDescriptors.length > 0 ? 'check_circle' : 'face'}</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold leading-none">Look Straight</p>
                                            <p className="text-[11px] text-slate-500">Center align face</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                                            <span className="material-symbols-outlined">light_mode</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold leading-none">Good Lighting</p>
                                            <p className="text-[11px] text-slate-500">Avoid shadows</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
                                    <h4 className="text-xs font-bold text-blue-800 mb-1.5 flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-sm">info</span> TIP
                                    </h4>
                                    <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                                        Remove glasses and masks. Ensure no other faces are visible in the frame for accurate detection.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 4: Consent & Declaration */}
                    <section id="consent" className="scroll-mt-24 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold text-slate-900">Consent & Declaration</h3>
                            <p className="text-slate-500 mt-1">Please review the data privacy policy and provide your acknowledgement.</p>
                        </div>
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                            <div className="p-6 bg-slate-50 rounded-2xl text-sm text-slate-600 max-h-48 overflow-y-auto border border-slate-100 leading-relaxed custom-scrollbar font-medium">
                                <p className="font-bold mb-2 text-slate-900">Biometric Data Processing Agreement</p>
                                <p className="mb-4">By enrolling in the EduGate face-recognition system, I voluntarily consent to the collection and processing of my biometric data (facial features) for the sole purpose of student identification and attendance tracking. This data will be securely stored in an encrypted format and will not be shared with third parties without prior authorization.</p>
                                <p className="mb-4">I understand that I have the right to revoke this consent at any time through the University Registrar's office, which may require transition to alternative identification methods.</p>
                                <p>All data processing complies with the General Data Protection Regulation (GDPR) and University Privacy Standards.</p>
                            </div>
                            <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:border-primary/30">
                                <div className="pt-0.5">
                                    <input
                                        id="consent-check"
                                        name="consent_given"
                                        type="checkbox"
                                        checked={formData.consent_given}
                                        onChange={handleChange}
                                        className="w-5 h-5 rounded-lg border-slate-300 text-primary focus:ring-primary focus:ring-offset-background transition-all"
                                    />
                                </div>
                                <label className="text-sm font-bold text-slate-700 flex-1 cursor-pointer" htmlFor="consent-check">
                                    I have read the biometric data processing agreement and confirm that all information provided is accurate and complete.
                                </label>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            {/* Sticky Bottom Action Bar */}
            <footer className="fixed bottom-0 left-0 right-0 lg:left-72 bg-white/95 backdrop-blur-md border-t border-slate-100 px-8 py-5 z-50 flex justify-between items-center shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.03)] animate-in slide-in-from-bottom-full duration-500">
                <div className="hidden sm:flex items-center gap-4 text-slate-400">
                    <span className="material-symbols-outlined text-primary">security</span>
                    <p className="text-[10px] max-w-[180px] leading-tight font-black uppercase tracking-tight">End-to-End Encrypted Secure Submission</p>
                </div>
                <div className="flex gap-4 w-full sm:w-auto">
                    <button
                        onClick={() => navigate('/login')}
                        className="flex-1 sm:flex-none px-6 py-4 font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-800 rounded-2xl transition-all border border-transparent hover:border-slate-100"
                    >
                        Save Draft
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!formData.consent_given || faceDescriptors.length === 0}
                        className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold px-10 py-4 rounded-2xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 group"
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
