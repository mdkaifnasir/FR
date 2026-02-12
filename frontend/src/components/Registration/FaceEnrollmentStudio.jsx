import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';

const FaceEnrollmentStudio = ({ onCaptureComplete, isScanning }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [feedback, setFeedback] = useState("Initializing AI...");

    // UI State
    const [progressState, setProgressState] = useState({
        front: false,
        left: false,
        right: false,
        smile: false,
        neutral: false
    });

    // Refs for Logic (Mutable, no re-renders)
    const progressRef = useRef({
        front: false,
        left: false,
        right: false,
        smile: false,
        neutral: false
    });
    const capturesRef = useRef([]);
    const frontImageRef = useRef(null);
    const scanningRef = useRef(false);

    // Sync scanning prop to ref
    useEffect(() => {
        scanningRef.current = isScanning;
    }, [isScanning]);

    useEffect(() => {
        let isMounted = true;
        const loadModels = async () => {
            const MODEL_URL = '/models';
            try {
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
                    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
                ]);
                if (isMounted) {
                    setModelsLoaded(true);
                    setFeedback("System Ready");
                }
            } catch (err) {
                console.error("Failed to load models:", err);
                if (isMounted) setFeedback("Engine Error");
            }
        };
        loadModels();
        return () => { isMounted = false; };
    }, []);

    // Start/Stop Video based on isScanning prop
    useEffect(() => {
        if (isScanning && modelsLoaded) {
            setFeedback("Position your face");
            startVideo();
        } else {
            stopVideo();
        }
    }, [isScanning, modelsLoaded]);

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
            if (!videoRef.current || !canvasRef.current || !scanningRef.current) return;
            if (videoRef.current.paused || videoRef.current.ended) return;

            const videoWidth = videoRef.current.videoWidth;
            const videoHeight = videoRef.current.videoHeight;
            if (videoWidth === 0 || videoHeight === 0) return;

            const displaySize = { width: videoWidth, height: videoHeight };
            faceapi.matchDimensions(canvasRef.current, displaySize);

            try {
                const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 }))
                    .withFaceLandmarks()
                    .withFaceExpressions()
                    .withFaceDescriptors();

                const ctx = canvasRef.current.getContext('2d');
                ctx.clearRect(0, 0, displaySize.width, displaySize.height);

                if (detections.length === 1) {
                    const detection = detections[0];
                    const landmarks = detection.landmarks;
                    const expressions = detection.expressions;
                    const descriptor = detection.descriptor;

                    // Simple Pose Estimation
                    const nose = landmarks.getNose()[0];
                    const jaw = landmarks.getJawOutline();
                    const leftJaw = jaw[0];
                    const rightJaw = jaw[16];
                    const distToLeft = Math.abs(nose.x - leftJaw.x);
                    const distToRight = Math.abs(nose.x - rightJaw.x);
                    const ratio = distToLeft / (distToRight + 0.01);

                    let pose = 'Front';
                    if (ratio < 0.65) pose = 'Right';
                    if (ratio > 1.35) pose = 'Left';

                    // Check Criteria
                    const currentProgress = progressRef.current;
                    let captured = false;
                    let newProgress = { ...currentProgress };

                    if (detection.detection.score > 0.8) {
                        if (pose === 'Front' && !currentProgress.front) { newProgress.front = true; captured = true; }
                        if (pose === 'Left' && !currentProgress.left) { newProgress.left = true; captured = true; }
                        if (pose === 'Right' && !currentProgress.right) { newProgress.right = true; captured = true; }
                        if (expressions.happy > 0.5 && !currentProgress.smile) { newProgress.smile = true; captured = true; }
                        if (expressions.neutral > 0.5 && !currentProgress.neutral) { newProgress.neutral = true; captured = true; }
                    }

                    if (captured) {
                        progressRef.current = newProgress;
                        capturesRef.current.push(descriptor);

                        // Capture front image for profile display
                        if (pose === 'Front' && !frontImageRef.current) {
                            const tempCanvas = document.createElement('canvas');
                            tempCanvas.width = videoRef.current.videoWidth;
                            tempCanvas.height = videoRef.current.videoHeight;
                            const tCtx = tempCanvas.getContext('2d');
                            // Drawing the video directly (mirrored as it appears in UI)
                            tCtx.translate(tempCanvas.width, 0);
                            tCtx.scale(-1, 1);
                            tCtx.drawImage(videoRef.current, 0, 0);
                            frontImageRef.current = tempCanvas.toDataURL('image/jpeg', 0.8);
                        }

                        setProgressState(newProgress);
                        setFeedback(`Success: ${pose}`);

                        if (newProgress.front && newProgress.left && newProgress.right && newProgress.smile && newProgress.neutral) {
                            if (scanningRef.current) {
                                scanningRef.current = false;
                                setFeedback("Complete!");
                                if (onCaptureComplete) {
                                    setTimeout(() => onCaptureComplete({
                                        descriptors: capturesRef.current,
                                        image: frontImageRef.current
                                    }), 800);
                                }
                            }
                        }
                    } else {
                        // Dynamic Instructions based on what's missing
                        if (!currentProgress.front) setFeedback("Look Front");
                        else if (!currentProgress.left) setFeedback("Turn Left");
                        else if (!currentProgress.right) setFeedback("Turn Right");
                        else if (!currentProgress.smile) setFeedback("Smile Please");
                        else if (!currentProgress.neutral) setFeedback("Look Neutral");
                    }
                } else if (detections.length === 0) {
                    setFeedback("Face not found");
                } else {
                    setFeedback("Multiple faces!");
                }
            } catch (error) {
                console.error("Detection Error:", error);
            }

        }, 500);
        return () => clearInterval(interval);
    };

    return (
        <div className="w-full flex flex-col items-center">
            {/* Camera Area - No overlapping instructions here */}
            <div className="relative w-full aspect-video bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 flex items-center justify-center group">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    onPlay={handleVideoPlay}
                    className={`absolute inset-0 w-full h-full object-cover transform scale-x-[-1] transition-opacity duration-300 ${!isScanning ? 'opacity-0' : 'opacity-100'}`}
                />
                <canvas ref={canvasRef} className={`absolute inset-0 w-full h-full object-cover transform scale-x-[-1] transition-opacity duration-300 ${!isScanning ? 'opacity-0' : 'opacity-100'}`} />

                {/* Visual Guide Box */}
                {isScanning && (
                    <div className="absolute inset-0 border-[40px] border-slate-900/40 pointer-events-none transition-all">
                        <div className="w-full h-full border-2 border-dashed border-white/30 rounded-[20px]"></div>
                    </div>
                )}
            </div>

            {/* Instruction Area - Dedicated space below video */}
            <div className="w-full py-6 flex flex-col items-center">
                <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${isScanning ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110' : 'bg-slate-100 text-slate-400'}`}>
                    {feedback}
                </div>

                {/* Progress Indicators - Modern horizontal bar style */}
                <div className="flex gap-4 mt-6 w-full justify-center">
                    <StatusItem label="Front" active={progressState.front} index={1} />
                    <StatusItem label="Left" active={progressState.left} index={2} />
                    <StatusItem label="Right" active={progressState.right} index={3} />
                    <StatusItem label="Smile" active={progressState.smile} index={4} />
                    <StatusItem label="Neutral" active={progressState.neutral} index={5} />
                </div>
            </div>

            <div className="flex gap-2 text-[10px] text-slate-400 items-center font-bold uppercase tracking-tighter">
                <span className="material-symbols-outlined text-xs">lock</span>
                Institutional Biometric standards applied
            </div>
        </div>
    );
};

const StatusItem = ({ label, active, index }) => (
    <div className="flex flex-col items-center gap-2">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black transition-all duration-500 border-2
            ${active ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200 scale-110' : 'bg-white border-slate-100 text-slate-300 rotate-3'}`}>
            {active ? <span className="material-symbols-outlined text-sm">check</span> : index}
        </div>
        <span className={`text-[9px] font-black uppercase tracking-tighter ${active ? 'text-emerald-600' : 'text-slate-400'}`}>{label}</span>
    </div>
);

export default FaceEnrollmentStudio;
