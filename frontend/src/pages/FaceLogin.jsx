import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FaceLogin = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [feedback, setFeedback] = useState("Position your face");
    const [isScanning, setIsScanning] = useState(true);
    const [error, setError] = useState("");
    const { loginByFace } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = '/models';
            try {
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
                ]);
                setModelsLoaded(true);
                startVideo();
            } catch (err) {
                console.error("Failed to load models:", err);
                setFeedback("Engine Error");
            }
        };
        loadModels();
        return () => stopVideo();
    }, []);

    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
            .then(stream => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            })
            .catch(err => {
                console.error("Camera Error:", err);
                setFeedback("Camera Unavailable");
            });
    };

    const stopVideo = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    };

    const handleVideoPlay = () => {
        const interval = setInterval(async () => {
            if (!videoRef.current || !canvasRef.current || !isScanning) return;

            try {
                const detection = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 }))
                    .withFaceLandmarks()
                    .withFaceDescriptor();

                if (detection) {
                    setIsScanning(false);
                    setFeedback("Face Captured! Verifying...");

                    try {
                        await loginByFace(Array.from(detection.descriptor));
                        navigate('/dashboard');
                    } catch (err) {
                        setError("Face not recognized. Please try again or use password.");
                        setFeedback("Recognition Failed");
                        setTimeout(() => {
                            setIsScanning(true);
                            setFeedback("Position your face");
                        }, 3000);
                    }
                }
            } catch (error) {
                console.error("Detection Error:", error);
            }
        }, 1000);
        return () => clearInterval(interval);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-200 min-h-screen flex items-center justify-center p-6 overflow-hidden">
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="pattern-bg absolute inset-0"></div>
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
            </div>

            <main className="relative z-10 w-full max-w-lg">
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-center p-10">
                    <header className="mb-8">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Face Recognition Login</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Position your face within the circle for attendance</p>
                    </header>

                    {error && (
                        <div className="p-3 mb-6 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl animate-shake">
                            {error}
                        </div>
                    )}

                    <div className="relative flex items-center justify-center mb-8">
                        <div className="absolute left-0 hidden md:flex flex-col items-center gap-2 text-slate-300 dark:text-slate-700">
                            <span className="material-symbols-outlined text-3xl">shield_lock</span>
                            <span className="text-[10px] uppercase tracking-widest font-semibold">Secure</span>
                        </div>

                        <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-full border-4 border-primary/20 p-1 bg-white dark:bg-slate-800 shadow-inner overflow-hidden">
                            <div className="w-full h-full rounded-full overflow-hidden relative bg-slate-100 dark:bg-slate-800">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    muted
                                    playsInline
                                    onPlay={handleVideoPlay}
                                    className="w-full h-full object-cover transform scale-x-[-1]"
                                />
                                <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>
                                {isScanning && <div className="scan-line"></div>}
                            </div>
                        </div>

                        <div className="absolute right-0 hidden md:flex flex-col items-center gap-2 text-slate-300 dark:text-slate-700">
                            <span className="material-symbols-outlined text-3xl">privacy_tip</span>
                            <span className="text-[10px] uppercase tracking-widest font-semibold">Private</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center min-h-[60px] mb-8">
                        <div className={`flex items-center gap-2 font-medium transition-all ${isScanning ? 'text-primary' : 'text-emerald-500'}`}>
                            <span className={`material-symbols-outlined ${isScanning ? 'animate-pulse' : ''}`}>
                                {isScanning ? 'sensors' : 'check_circle'}
                            </span>
                            <span className="text-lg">{feedback}</span>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                        <Link to="/login" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-lg">keyboard</span>
                            Cancel and use password
                        </Link>
                    </div>
                </div>

                <footer className="mt-8 text-center">
                    <div className="inline-flex items-center gap-4 px-4 py-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-full border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">System Online</span>
                        </div>
                        <div className="w-px h-3 bg-slate-300 dark:bg-slate-700"></div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                            v2.4.0 Secure Node
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default FaceLogin;
