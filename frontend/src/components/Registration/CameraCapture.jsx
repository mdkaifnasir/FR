import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';

const CameraCapture = ({ onCapture, onBack }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [captureCount, setCaptureCount] = useState(0);
    const [descriptors, setDescriptors] = useState([]);
    const [message, setMessage] = useState("Initializing Face API...");
    const [isCapturing, setIsCapturing] = useState(false);

    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = '/models'; // Ensure models are in public/models
            try {
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
                ]);
                setModelsLoaded(true);
                setMessage("Models Loaded. Starting Camera...");
                startVideo();
            } catch (err) {
                console.error("Failed to load models", err);
                setMessage("Error: Failed to load face recognition models. Please ensure models are in public/models.");
            }
        };
        loadModels();
    }, []);

    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: {} })
            .then((stream) => {
                videoRef.current.srcObject = stream;
            })
            .catch((err) => {
                console.error("Error accessing camera", err);
                setMessage("Error: Cannot access camera.");
            });
    };

    const handleVideoPlay = () => {
        const interval = setInterval(async () => {
            if (videoRef.current && canvasRef.current && !isCapturing && captureCount < 5) { // Auto capture 5 good frames
                const displaySize = { width: videoRef.current.width, height: videoRef.current.height };
                faceapi.matchDimensions(canvasRef.current, displaySize);

                const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                    .withFaceLandmarks()
                    .withFaceDescriptors();

                const resizedDetections = faceapi.resizeResults(detections, displaySize);

                // Clear canvas
                const ctx = canvasRef.current.getContext('2d');
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

                // Draw box
                faceapi.draw.drawDetections(canvasRef.current, resizedDetections);

                // Check logic: Single face, good confidence?
                if (detections.length === 1) {
                    const detection = detections[0];
                    if (detection.detection.score > 0.8) {
                        // Good face, save descriptor
                        // We could also enforce pose (using landmarks) here.
                        setDescriptors(prev => [...prev, detection.descriptor]);
                        setCaptureCount(prev => prev + 1);
                    }
                }
            }
        }, 500); // Check every 500ms

        return () => clearInterval(interval);
    };

    useEffect(() => {
        if (captureCount >= 5) {
            setMessage("Face Enrollment Complete!");
            // Calculate mean descriptor or just pass the first one for now.
            // Simplified: passing the first valid descriptor. Ideally average them.
            onCapture(Array.from(descriptors[0]));
        } else if (modelsLoaded) {
            setMessage(`Capturing Face Data... ${captureCount}/5`);
        }
    }, [captureCount, modelsLoaded]);


    return (
        <div className="flex flex-col items-center">
            <h3 className="text-xl font-bold mb-4">Face Enrollment</h3>
            <p className="mb-4 text-blue-600 font-semibold">{message}</p>

            <div className="relative">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    width="640"
                    height="480"
                    onPlay={handleVideoPlay}
                    className="rounded-lg shadow-lg"
                />
                <canvas ref={canvasRef} className="absolute top-0 left-0" />
            </div>

            <div className="mt-4">
                <button onClick={onBack} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">Back</button>
            </div>
        </div>
    );
};

export default CameraCapture;
