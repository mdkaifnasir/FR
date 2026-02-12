import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';

const FaceEnrollmentStudio = ({ onCaptureComplete, isScanning }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [feedback, setFeedback] = useState("Initializing...");

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
                console.log("Loading FaceAPI models...");
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
                    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
                ]);
                if (isMounted) {
                    console.log("Models loaded successfully");
                    setModelsLoaded(true);
                }
            } catch (err) {
                console.error("Failed to load models:", err);
                if (isMounted) setFeedback("Error loading AI models. Check console.");
            }
        };
        loadModels();
        return () => { isMounted = false; };
    }, []);

    // Start/Stop Video based on isScanning prop
    useEffect(() => {
        if (isScanning && modelsLoaded) {
            setFeedback("Position your face in the frame");
            startVideo();
        } else {
            stopVideo();
        }
    }, [isScanning, modelsLoaded]);

    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: {} })
            .then(stream => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            })
            .catch(err => {
                console.error("Camera Error:", err);
                setFeedback("Camera access denied or unavailable");
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

            // Use videoWidth/videoHeight for intrinsic resolution
            const videoWidth = videoRef.current.videoWidth;
            const videoHeight = videoRef.current.videoHeight;

            if (videoWidth === 0 || videoHeight === 0) return;

            const displaySize = { width: videoWidth, height: videoHeight };

            // Match canvas to video dimensions
            // NOTE: We need to ensure the canvas IS the same size visually as the video
            // If the video is styled with CSS (w-full h-full), the internal resolution 
            // of the canvas must match the video stream resolution.
            faceapi.matchDimensions(canvasRef.current, displaySize);

            try {
                // Update feedback only if "Scanning" to avoid flickering
                // setFeedback("Scanning..."); 

                const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 }))
                    .withFaceLandmarks()
                    .withFaceExpressions()
                    .withFaceDescriptors();

                // Debug log
                // if (detections.length > 0) console.log("Face Detected:", detections[0].detection.score);

                const resizedDetections = faceapi.resizeResults(detections, displaySize);

                const ctx = canvasRef.current.getContext('2d');
                ctx.clearRect(0, 0, displaySize.width, displaySize.height);

                if (detections.length === 1) {
                    const detection = detections[0];
                    const landmarks = detection.landmarks;
                    const expressions = detection.expressions;
                    const descriptor = detection.descriptor;

                    // Simple Pose Estimation (Yaw)
                    const nose = landmarks.getNose()[0];
                    const leftEye = landmarks.getLeftEye()[0];
                    const rightEye = landmarks.getRightEye()[0];
                    const jaw = landmarks.getJawOutline();
                    const leftJaw = jaw[0];
                    const rightJaw = jaw[16];

                    // Calculate ratios to estimate turn
                    const distToLeft = Math.abs(nose.x - leftJaw.x);
                    const distToRight = Math.abs(nose.x - rightJaw.x);
                    const ratio = distToLeft / (distToRight + 0.01);

                    let pose = 'Front';
                    if (ratio < 0.6) pose = 'Right'; // Looking right (from camera perspective looks like left cheek hidden)
                    if (ratio > 1.4) pose = 'Left';

                    // Draw Box
                    const box = resizedDetections[0].detection.box;
                    const drawBox = new faceapi.draw.DrawBox(box, { label: pose });
                    drawBox.draw(canvasRef.current);

                    // Check Criteria using Refs (Current State)
                    const currentProgress = progressRef.current;
                    let captured = false;
                    let newProgress = { ...currentProgress };

                    if (detection.detection.score > 0.8) {
                        if (pose === 'Front' && !currentProgress.front) { newProgress.front = true; captured = true; }
                        if (pose === 'Left' && !currentProgress.left) { newProgress.left = true; captured = true; }
                        if (pose === 'Right' && !currentProgress.right) { newProgress.right = true; captured = true; }

                        // Lower threshold for expressions to make it easier
                        if (expressions.happy > 0.5 && !currentProgress.smile) { newProgress.smile = true; captured = true; }
                        if (expressions.neutral > 0.5 && !currentProgress.neutral) { newProgress.neutral = true; captured = true; }
                    }

                    if (captured) {
                        // Update Logic Refs
                        progressRef.current = newProgress;
                        capturesRef.current.push(descriptor);

                        // Update UI State separately
                        setProgressState(newProgress);

                        // Visual feedback
                        setFeedback(`Captured: ${pose} / ${expressions.happy > 0.5 ? 'Smile' : 'Neutral'}`);

                        // Check Completion
                        if (newProgress.front && newProgress.left && newProgress.right && newProgress.smile) {
                            if (scanningRef.current) {
                                scanningRef.current = false; // Stop further captures
                                setFeedback("Enrollment Complete!");
                                if (onCaptureComplete) {
                                    setTimeout(() => {
                                        onCaptureComplete(capturesRef.current);
                                    }, 1000);
                                }
                            }
                        }
                    }

                } else {
                    setFeedback(detections.length === 0 ? "No face detected" : "Multiple faces detected");
                }
            } catch (error) {
                console.error("Detection Error:", error);
            }

        }, 500);
        return () => clearInterval(interval);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center h-full">
            <h3 className="text-xl font-bold mb-2">Face Enrollment Studio</h3>
            <p className="text-gray-500 mb-6 text-sm">Position your face within the frame to begin.</p>

            <div className="relative w-full max-w-md aspect-square bg-gray-900 rounded-2xl overflow-hidden shadow-inner border-4 border-gray-100 flex items-center justify-center">
                {!isScanning && (
                    <div className="text-center p-6 text-gray-400">
                        <div className="text-4xl mb-2">📷</div>
                        <p>Complete academic details to enable camera</p>
                    </div>
                )}

                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    onPlay={handleVideoPlay}
                    className={`absolute inset-0 w-full h-full object-contain transform scale-x-[-1] ${!isScanning ? 'hidden' : ''}`}
                />
                <canvas ref={canvasRef} className={`absolute inset-0 w-full h-full object-contain transform scale-x-[-1] ${!isScanning ? 'hidden' : ''}`} />

                {/* Overlay UI */}
                {isScanning && (
                    <div className="absolute top-4 left-0 right-0 text-center">
                        <span className="bg-black/50 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            {feedback}
                        </span>
                    </div>
                )}
            </div>

            {/* Progress Indicators */}
            <div className="flex gap-6 mt-8 w-full justify-center">
                <StatusItem label="Front" active={progressState.front} icon="✓" />
                <StatusItem label="Left" active={progressState.left} icon="←" />
                <StatusItem label="Right" active={progressState.right} icon="→" />
                <StatusItem label="Smile" active={progressState.smile} icon="☺" />
                <StatusItem label="Neutral" active={progressState.neutral} icon="😐" />
            </div>

            <div className="mt-6 flex gap-2 text-xs text-gray-400 items-center">
                <span>🔒</span> Your biometric data is encrypted end-to-end.
            </div>
        </div>
    );
};

const StatusItem = ({ label, active, icon }) => (
    <div className="flex flex-col items-center gap-2">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all
            ${active ? 'bg-blue-500 border-blue-500 text-white' : 'bg-gray-50 border-gray-200 text-gray-300'}`}>
            {icon}
        </div>
        <span className={`text-xs font-medium ${active ? 'text-blue-600' : 'text-gray-400'}`}>{label}</span>
    </div>
);

export default FaceEnrollmentStudio;
