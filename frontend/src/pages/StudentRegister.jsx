import React, { useState } from 'react';
import Navbar from '../components/Registration/Navbar';
import FaceEnrollmentStudio from '../components/Registration/FaceEnrollmentStudio';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const StudentRegister = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isScanning, setIsScanning] = useState(false);
    const [formData, setFormData] = useState({
        name: '', student_id: '', email: '', mobile: '', gender: '', dob: '',
        college: '', department: '', course: '', semester: '', division: '', academic_year: '',
        consent_given: false
    });
    const [faceDescriptors, setFaceDescriptors] = useState([]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleContinueToScan = () => {
        if (step === 1) setStep(2);
        else if (step === 2) {
            setStep(3);
            setIsScanning(true);
        }
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

    return (
        <div className="min-h-screen font-display bg-background-light dark:bg-background-dark relative overflow-hidden">
            {/* Background Elements */}
            <div className="campus-pattern"></div>
            <div className="architectural-overlay"></div>

            <Navbar />

            <div className="flex flex-col lg:flex-row max-w-7xl mx-auto min-h-[calc(100vh-64px)] relative z-10">
                {/* LEFT COLUMN: FORM */}
                <div className="w-full lg:w-1/2 p-6 lg:p-10">
                    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-slate-200/50 dark:border-slate-800">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Student Registration</h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-2">Create your academic profile for the attendance system.</p>
                        </div>

                        {/* Stepper */}
                        <div className="flex items-center gap-4 mb-10 text-sm font-medium">
                            <StepLabel num={1} label="Personal" active={step >= 1} current={step === 1} />
                            <div className="flex-1 h-[2px] bg-slate-200 dark:bg-slate-700">
                                <div className={`h-full bg-primary transition-all duration-300 ${step >= 2 ? 'w-full' : 'w-0'}`}></div>
                            </div>
                            <StepLabel num={2} label="Academic" active={step >= 2} current={step === 2} />
                            <div className="flex-1 h-[2px] bg-slate-200 dark:bg-slate-700">
                                <div className={`h-full bg-primary transition-all duration-300 ${step >= 3 ? 'w-full' : 'w-0'}`}></div>
                            </div>
                            <StepLabel num={3} label="Review" active={step >= 3} current={step === 3} />
                        </div>

                        {/* Form Steps */}
                        <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                            {step === 1 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                        <span className="material-icons text-primary">person</span> Basic Identity
                                    </h3>
                                    <FormInput label="Full Name" name="name" placeholder="e.g. Jane Alice Doe" value={formData.name} onChange={handleChange} icon="badge" />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <FormInput label="Student ID / Roll No" name="student_id" placeholder="e.g. 2024-CS-042" value={formData.student_id} onChange={handleChange} icon="id_card" />
                                        <FormInput label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} icon="calendar_today" />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <FormInput label="Email Address" name="email" type="email" placeholder="student@college.edu" value={formData.email} onChange={handleChange} icon="mail" />
                                        <FormInput label="Mobile Number" name="mobile" placeholder="+1 (555) 000-0000" value={formData.mobile} onChange={handleChange} icon="phone" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Gender</label>
                                        <div className="flex gap-6">
                                            <RadioOption name="gender" value="Male" checked={formData.gender === 'Male'} onChange={handleChange} />
                                            <RadioOption name="gender" value="Female" checked={formData.gender === 'Female'} onChange={handleChange} />
                                            <RadioOption name="gender" value="Other" checked={formData.gender === 'Other'} onChange={handleChange} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                        <span className="material-icons text-primary">school</span> Academic Info
                                    </h3>
                                    <FormSelect label="College / Institute" name="college" value={formData.college} onChange={handleChange} options={["Springfield Institute of Technology", "Other"]} icon="account_balance" />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <FormSelect label="Department" name="department" value={formData.department} onChange={handleChange} options={["Computer Science", "IT", "Mechanical"]} icon="category" />
                                        <FormSelect label="Course / Degree" name="course" value={formData.course} onChange={handleChange} options={["B.Tech", "B.Sc", "MCA"]} icon="history_edu" />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <FormSelect label="Year / Semester" name="semester" value={formData.semester} onChange={handleChange} options={["1st Year", "2nd Year", "3rd Year", "4th Year"]} icon="timeline" />
                                        <FormSelect label="Division" name="division" value={formData.division} onChange={handleChange} options={["A", "B", "C"]} icon="groups" />
                                    </div>
                                    <FormSelect label="Academic Year" name="academic_year" value={formData.academic_year} onChange={handleChange} options={["2025-26", "2024-25"]} icon="calendar_today" />
                                </div>
                            )}

                            {step >= 3 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Review & Consent</h3>
                                    <div className={`p-4 rounded-xl border transition-all ${formData.consent_given ? 'bg-primary/5 border-primary/20' : 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700'}`}>
                                        <label className="flex items-start gap-3 cursor-pointer">
                                            <input type="checkbox" name="consent_given" checked={formData.consent_given} onChange={handleChange} className="mt-1 w-5 h-5 text-primary rounded ring-offset-background focus:ring-2 focus:ring-primary" />
                                            <div className="text-sm text-slate-600 dark:text-slate-400">
                                                <strong className="text-slate-800 dark:text-slate-200">Consent & Declaration</strong><br />
                                                I verify that the information provided is accurate and I consent to the collection and storage of my biometric face data for automated attendance purposes.
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-10 flex gap-4">
                            {step > 1 && (
                                <button onClick={() => setStep(step - 1)} className="px-6 py-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center">
                                    <span className="material-icons mr-2 text-sm">arrow_back</span> Back
                                </button>
                            )}

                            {step < 3 ? (
                                <button onClick={handleContinueToScan} className="flex-1 bg-primary text-white font-semibold py-3 px-6 rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center justify-center">
                                    Continue to {step === 1 ? 'Academic Info' : 'Face Scan'} <span className="material-icons ml-2 text-sm">arrow_forward</span>
                                </button>
                            ) : (
                                <button onClick={handleSubmit} disabled={!formData.consent_given || faceDescriptors.length === 0}
                                    className="flex-1 bg-primary disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white font-semibold py-3 px-6 rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center justify-center">
                                    <span className="material-icons mr-2">check_circle</span> Submit Registration
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: FACE STUDIO */}
                <div className="w-full lg:w-1/2 p-6 lg:p-10 flex flex-col justify-center">
                    <div className="bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl border-4 border-dashed border-slate-200 dark:border-slate-700 overflow-hidden min-h-[400px] flex items-center justify-center relative">
                        <FaceEnrollmentStudio
                            isScanning={isScanning}
                            onCaptureComplete={handleFaceCaptureComplete}
                        />
                        {/* Status Overlay */}
                        {!isScanning && faceDescriptors.length > 0 && (
                            <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-lg animate-bounce">
                                <span className="material-icons text-xs mr-1">check</span> FACE CAPTURED
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// UI Helpers
const StepLabel = ({ num, label, active, current }) => (
    <div className={`flex items-center gap-2 ${active ? 'text-primary' : 'text-slate-400'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all duration-300
            ${active ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'}`}>
            {num}
        </div>
        <span className={`text-xs uppercase tracking-wider ${current ? 'font-bold' : 'font-medium'}`}>{label}</span>
    </div>
);

const FormInput = ({ label, icon, ...props }) => (
    <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
        <div className="relative">
            {icon && (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-icons text-slate-400 text-sm">{icon}</span>
                </div>
            )}
            <input {...props} className={`w-full ${icon ? 'pl-10' : 'px-4'} py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all`} />
        </div>
    </div>
);

const FormSelect = ({ label, options, icon, ...props }) => (
    <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
        <div className="relative">
            {icon && (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-icons text-slate-400 text-sm">{icon}</span>
                </div>
            )}
            <select {...props} className={`w-full ${icon ? 'pl-10' : 'px-4'} py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none outline-none`}>
                <option value="">Select...</option>
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                <span className="material-icons">expand_more</span>
            </div>
        </div>
    </div>
);

const RadioOption = ({ label, ...props }) => (
    <label className="flex items-center gap-2 cursor-pointer group">
        <input type="radio" {...props} className="w-4 h-4 text-primary border-slate-300 focus:ring-primary transition-all" />
        <span className="text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors">{props.value}</span>
    </label>
);

export default StudentRegister;
