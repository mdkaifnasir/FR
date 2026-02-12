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
        // Validation logic here could go here
        if (step === 1) setStep(2);
        else if (step === 2) {
            setStep(3);
            setIsScanning(true);
        }
    };

    const handleFaceCaptureComplete = (descriptors) => {
        setFaceDescriptors(descriptors);
        setIsScanning(false);
        // Automatically save or let user click save? 
        // Design has "Save Draft" and "Continue" but for MVP let's auto-complete or enable submit
    };

    const handleSubmit = async () => {
        if (!formData.consent_given) return alert("Please Provide Consent");
        if (faceDescriptors.length === 0) return alert("Please complete Face Scan");

        try {
            // Send the first descriptor or average them (backend expects array)
            // Backend update required if we want to store multiple. 
            // For now, let's send the first one as 'face_descriptor'
            const payload = {
                ...formData,
                face_descriptor: Array.from(faceDescriptors[0])
            };
            console.log("Submitting Payload:", payload);

            await api.post('/students', payload);
            alert("Registration Successful!");
            navigate('/login');
        } catch (error) {
            alert("Registration Failed: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />

            <div className="flex flex-col lg:flex-row max-w-8xl mx-auto min-h-[calc(100vh-64px)]">

                {/* LEFT COLUMN: FORM */}
                <div className="w-full lg:w-1/2 p-8 lg:p-12 overflow-y-auto">
                    <div className="max-w-xl mx-auto">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Registration</h1>
                        <p className="text-gray-500 mb-8">Complete your academic profile details below.</p>

                        {/* Stepper */}
                        <div className="flex items-center gap-4 mb-10 text-sm font-medium">
                            <StepLabel num={1} label="Personal" active={step >= 1} current={step === 1} />
                            <div className="w-8 h-[1px] bg-gray-300"></div>
                            <StepLabel num={2} label="Academic" active={step >= 2} current={step === 2} />
                            <div className="w-8 h-[1px] bg-gray-300"></div>
                            <StepLabel num={3} label="Review" active={step >= 3} current={step === 3} />
                        </div>

                        {/* Step 1: Personal */}
                        {step === 1 && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <span className="text-blue-600">👤</span> Basic Identity
                                </h3>

                                <FormInput label="Full Name" name="name" placeholder="e.g. Jane Alice Doe" value={formData.name} onChange={handleChange} />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormInput label="Student ID / Roll No" name="student_id" placeholder="e.g. 2024-CS-042" value={formData.student_id} onChange={handleChange} />
                                    <FormInput label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormInput label="Email Address" name="email" type="email" placeholder="student@college.edu" value={formData.email} onChange={handleChange} />
                                    <FormInput label="Mobile Number" name="mobile" placeholder="+1 (555) 000-0000" value={formData.mobile} onChange={handleChange} />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                                    <div className="flex gap-6">
                                        <RadioOption name="gender" value="Male" checked={formData.gender === 'Male'} onChange={handleChange} />
                                        <RadioOption name="gender" value="Female" checked={formData.gender === 'Female'} onChange={handleChange} />
                                        <RadioOption name="gender" value="Other" checked={formData.gender === 'Other'} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Academic */}
                        {step === 2 && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <span className="text-blue-600">🎓</span> Academic Info
                                </h3>

                                <FormSelect label="College / Institute" name="college" value={formData.college} onChange={handleChange} options={["Springfield Institute of Technology", "Other"]} />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormSelect label="Department" name="department" value={formData.department} onChange={handleChange} options={["Computer Science", "IT", "Mechanical"]} />
                                    <FormSelect label="Course / Degree" name="course" value={formData.course} onChange={handleChange} options={["B.Tech", "B.Sc", "MCA"]} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormSelect label="Year / Semester" name="semester" value={formData.semester} onChange={handleChange} options={["1st Year", "2nd Year", "3rd Year", "4th Year"]} />
                                    <FormSelect label="Division" name="division" value={formData.division} onChange={handleChange} options={["A", "B", "C"]} />
                                </div>

                                <FormSelect label="Academic Year" name="academic_year" value={formData.academic_year} onChange={handleChange} options={["2025-26", "2024-25"]} />
                            </div>
                        )}

                        {/* Step 3: Consent & Review (Can also be part of Step 2 or visible always) */}
                        {step >= 3 && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-gray-800">Review & Consent</h3>
                                <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-start gap-3">
                                    <input type="checkbox" name="consent_given" checked={formData.consent_given} onChange={handleChange} className="mt-1 w-5 h-5 text-blue-600 rounded" />
                                    <div className="text-sm text-gray-700">
                                        <strong>Consent & Declaration</strong><br />
                                        I verify that the information provided is accurate and I consent to the collection and storage of my biometric face data for automated attendance purposes in accordance with the college privacy policy.
                                    </div>
                                </div>
                            </div>
                        )}


                        {/* Action Buttons */}
                        <div className="mt-10 flex gap-4">
                            {step > 1 && (
                                <button onClick={() => setStep(step - 1)} className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50">
                                    Back
                                </button>
                            )}

                            {step < 3 ? (
                                <button onClick={handleContinueToScan} className="flex-1 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                                    Continue to {step === 1 ? 'Academic Info' : 'Face Scan'} →
                                </button>
                            ) : (
                                <button onClick={handleSubmit} disabled={!formData.consent_given || faceDescriptors.length === 0}
                                    className="flex-1 bg-green-600 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors">
                                    Submit Registration
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: FACE STUDIO */}
                <div className="w-full lg:w-1/2 bg-gray-100 p-8 lg:p-12 flex flex-col justify-center">
                    <FaceEnrollmentStudio
                        isScanning={isScanning}
                        onCaptureComplete={handleFaceCaptureComplete}
                    />
                </div>

            </div>
        </div>
    );
};

// UI Helpers
const StepLabel = ({ num, label, active, current }) => (
    <div className={`flex items-center gap-2 ${active ? 'text-blue-600' : 'text-gray-400'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border 
            ${active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-300 text-gray-500'}`}>
            {num}
        </div>
        <span className={current ? 'font-bold' : 'font-medium'}>{label}</span>
    </div>
);

const FormInput = ({ label, ...props }) => (
    <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input {...props} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
    </div>
);

const FormSelect = ({ label, options, ...props }) => (
    <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <select {...props} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
            <option value="">Select...</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);

const RadioOption = ({ label, ...props }) => (
    <label className="flex items-center gap-2 cursor-pointer">
        <input type="radio" {...props} className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
        <span className="text-gray-700">{props.value}</span>
    </label>
);

export default StudentRegister;
