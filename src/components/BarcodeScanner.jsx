import React, { useRef, useEffect, useState } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { toast } from 'react-toastify';

const BarcodeScanner = ({ qrData, setQrData }) => {
    const videoRef = useRef(null);
    const [currentCameraId, setCurrentCameraId] = useState('')
    const [videoInputDevices, setVideoInputDevices] = useState([])
    const codeReader = new BrowserMultiFormatReader();
    const [willHide, setWillHide] = useState(false)

    const qrCodeSuccess = (result) => {
        if (qrData !== '') return;

        codeReader.stopAsyncDecode();
        setQrData(() => { return result });

        setWillHide(() => true)
    }


    useEffect(() => {
        codeReader
            .listVideoInputDevices()
            .then((videoInputDevices) => {
                if (videoInputDevices.length > 0) {

                    setVideoInputDevices(() => { return videoInputDevices });

                    // console.log(videoInputDevices)
                    // set to the first camera by default
                    const constraints = {
                        video: {
                            deviceId: videoInputDevices[0].deviceId,
                        },
                    };

                    codeReader.decodeFromVideoDevice(
                        (currentCameraId == '') ? constraints.video.deviceId : currentCameraId,
                        videoRef.current,
                        (result, error) => {
                            if (result) {
                                qrCodeSuccess(result)
                                // Do something with the barcode result
                            }
                            if (error && !(error instanceof NotFoundException)) {
                                console.error('Error:', error);
                            }
                        }
                    );

                    codeReader.decodeOnceFromVideoDevice(
                        (currentCameraId == '') ? constraints.video.deviceId : currentCameraId,

                        videoRef.current,
                        (result, error) => {
                            if (result) {
                                qrCodeSuccess(result)
                                // Do something with the barcode result
                            }
                            if (error && !(error instanceof NotFoundException)) {
                                console.error('Error:', error);
                            }
                        });
                } else {
                    toast.warn('No video input devices found.');
                }
            })
            .catch((error) => {
                console.error('Video input devices error:', error);
            });

        return () => {
            codeReader.reset();
            if (videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
                // stopCamera();
                codeReader.stopAsyncDecode();
                setWillHide(() => true)
            }
        };
    }, []);

    const changeCamera = (event) => {
        let deviceId = event.target.value;
        setCurrentCameraId(() => { return deviceId });
    }


    return (
        <div hidden={willHide}>
            <h3 className='text-light'>Scan the QR Code in your Voter Card</h3>
            <video ref={videoRef} autoPlay />

            {/* <select value={currentCameraId} onChange={changeCamera} className="form-select" aria-label="Default select example" style={{ width: 'fit-content' }}>
                {
                    videoInputDevices.map((item) => {
                        return <option key={item.deviceId} value={item.deviceId}>{item.label}</option>
                    })
                }
            </select> */}

        </div>
    );
};

export default BarcodeScanner;
