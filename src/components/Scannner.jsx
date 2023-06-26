import React, { useEffect, useRef, useState } from 'react';
import '../styles/Scanner.css';
import { toast } from 'react-toastify';
import { BrowserMultiFormatReader } from '@zxing/library';

const Scanner = ({ qrData, setQrData }) => {
    const codeReader = new BrowserMultiFormatReader();;

    // Ref variables
    const videoElementRef = useRef(null);
    const canvasRef = useRef(null);
    const imageRef = useRef(null);

    // State variables
    const [cameraActive, setCameraActive] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        startCamera();

        return () => {
            stopCamera();
        };
    }, []);

    const startCamera = async () => {
        try {
            if (!cameraActive) {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                videoElementRef.current.srcObject = stream;
                await videoElementRef.current.play();
                setCameraActive(true);
            }
        } catch (error) {
            setErrorMessage('Error accessing the webcam. Please grant camera access permission.');
            console.error('Error accessing the webcam:');
            console.log(error);
            toast.error('Error accessing the webcam. Please grant camera access permission.');
        }
    };

    const stopCamera = () => {
        pauseCamera();
        setCameraActive(false);
        // codeReader.reset();
    };

    const pauseCamera = () => {
        videoElementRef.current.pause();
    };

    const takeScreenshot = () => {
        const canvas = canvasRef.current;
        const videoElement = videoElementRef.current;

        if (canvas && videoElement) {
            canvas.width = videoElement.videoWidth / 2;
            canvas.height = videoElement.videoHeight / 2;
            const context = canvas.getContext('2d');
            context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            const imageDataURL = canvas.toDataURL('image/jpeg');
            // Do something with the imageDataURL


            codeReader.decodeFromImage(imageRef.current).then((result) => {
                setErrorMessage(`data : (${result})`);
            }).catch((err) => {
                toast.error("ERROR IN DECODEIMAGE")
                console.error(err)
            })
        }
    };

    const onNewScanResult = (result) => {
        if (result) {
            toast.success('QR Data received successfully');
        }
    };

    return (
        <div className="text-light">
            <h2 className="text-light">Scan Your QR Code</h2>
            <p>Camera</p>

            {errorMessage && <p className='text-danger'>{errorMessage}</p>}

            <br />

            <video id="videoElement" ref={videoElementRef}></video>
            <canvas ref={canvasRef}></canvas>
            <br />
            {cameraActive ? (
                <button onClick={stopCamera}>Stop Camera</button>
            ) : (
                <button onClick={startCamera}>Start Camera</button>
            )}

            <button onClick={takeScreenshot}>Take Photo</button>

            <br /> <br />

            <img ref={imageRef} src="./qrcode.png" alt="" height={100} width={100} />

        </div>
    );
};

export default Scanner;
