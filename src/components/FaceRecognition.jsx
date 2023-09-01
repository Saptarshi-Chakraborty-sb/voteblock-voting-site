import * as faceapi from 'face-api.js'
import { useEffect, useRef, useState } from 'react'
import CONSTANT from '../constants'
import { toast } from 'react-toastify'

function FaceRecognition({ faceVerified, setFaceVerified, voterImages, }) {
    const videoRef = useRef(null)
    const canvasRef = useRef(null)
    const queryImageRef = useRef(null)

    const [captureVideo, setCaptureVideo] = useState(false);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [labeledImagesLoaded, setLabeledImagesLoaded] = useState(false);
    const [matchingResult, setMatchingResult] = useState([]);

    // function to start webcam
    const startWebcam = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                videoRef.current.srcObject = stream
                videoRef.current.play()
                setCaptureVideo(true)
            })
            .catch(err => console.error(err))
    }


    // function to stop webcam
    const stopWebcam = () => {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop())
        setCaptureVideo(false)
    }

    // function to capture image
    const captureImage = () => {
        if (!captureVideo) return alert('Please start the camera first')
        const canvas = canvasRef.current
        canvas.width = videoRef.current.videoWidth
        canvas.height = videoRef.current.videoHeight
        canvas.getContext('2d').drawImage(videoRef.current, 0, 0)
        const image = canvas.toDataURL('image/png')
        queryImageRef.current.src = image
        // console.log(image)
    }


    // function to toggle webcam
    const toggleWebcam = () => {
        if (captureVideo) {
            stopWebcam()
        } else {
            startWebcam()
        }
    }


    // function to load models
    const loadModels = async () => {
        const MODEL_URL = '/models'
        console.log(`Loading models from ${MODEL_URL}`);
        await faceapi.loadSsdMobilenetv1Model(MODEL_URL)
        await faceapi.loadFaceLandmarkModel(MODEL_URL)
        await faceapi.loadFaceRecognitionModel(MODEL_URL)

        console.log('Models loaded successfully');
        setModelsLoaded(true)
    }


    // function to match faces
    const matchFaces = async () => {
        const labeledFaceDescriptors = await loadLabeledImages()
        const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
        const input = canvasRef.current
        const detections = await faceapi.detectAllFaces(input).withFaceLandmarks().withFaceDescriptors()
        const results = detections.map(d => faceMatcher.findBestMatch(d.descriptor))

        if (results.length === 0) {
            toast.error('No face detected. Please try again')
            return;
        }
        else if (results.length > 1) {
            toast.error('Multiple faces detected. Please try again')
            return;
        }

        if (results[0]._label === 'verifiedUser') {
            stopWebcam();
            toast.success('Face verified successfully')
            setFaceVerified(true)
        }

        setMatchingResult(results)
        console.log(results);
    }

    // function to load labeled images
    const loadLabeledImages = async () => {
        const labels = ['verifiedUser']

        return Promise.all(
            labels.map(async label => {
                const descriptions = []
                for (let i = 0; i < voterImages.length; i++) {
                    const imageName = voterImages[i];
                    const img = await faceapi.fetchImage(`${CONSTANT.imageFetchApi}${imageName}`); // fetch image from server
                    const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
                    descriptions.push(detections.descriptor)
                }

                console.log("Images loaded successfully");
                setLabeledImagesLoaded(true)

                return new faceapi.LabeledFaceDescriptors(label, descriptions)
            })
        )
    }

    // function to start face matching
    const startFaceMatching = () => {
        if (!modelsLoaded) return alert('Please load models first')
        if (!labeledImagesLoaded) return alert('Please load labeled images first')

        captureImage()
        matchFaces()
    }



    useEffect(() => {
        // loadModels().then(loadLabeledImages).then(matchFaces).then(startWebcam)
        if (voterImages.length < 4) return alert('Please upload images first')

        loadModels().then(loadLabeledImages).then(startWebcam)

    }, [voterImages])



    return (
        <>
            <div className='text-light'>
                <h2><center>FACE RECOGNITION</center></h2>

                {
                    (loadModels == false ||  loadLabeledImages == false ) &&
                    <div>Loading...</div>
                }


                <div className="">
                    <video ref={videoRef} style={{ borderRadius: '10px' }} autoPlay={true} />
                    <canvas ref={canvasRef} style={{ border: '1px solid black' }} ></canvas>
                </div>


                {/* <button onClick={toggleWebcam}>Start camera</button> */}

                <div className="hidden" style={{ display: "none" }}>
                    {/* <div className="hidden" style={{ display: "block" }}> */}
                    <img ref={queryImageRef} src="" alt="input" />
                </div>

                {
                    // ACTION BUTTTONS
                    (modelsLoaded && labeledImagesLoaded) &&
                    <>
                        {/* <button onClick={captureImage}>Capture Image</button> */}
                        <button onClick={startFaceMatching}>Capture Image</button>
                    </>
                }

                {/* Testing Purpose */}
                {/* <div style={{ border: "1px solid red", marginTop: "25px" }}>
                    <h3>Matching Result</h3>
                    {
                        matchingResult.map((result, index) => {
                            return (
                                <div key={index}>
                                    <p>{result._label}</p>
                                    <p>{result._distance}</p>
                                </div>
                            )
                        })
                    }
                </div> */}


            </div>

        </>
    )
}

export default FaceRecognition
