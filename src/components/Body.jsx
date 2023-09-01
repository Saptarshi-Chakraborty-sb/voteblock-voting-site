import React, { useEffect, useState } from 'react'
import VoterDetails from './VoterDetails'
import VotingBox from './VotingBox'
import { toast } from 'react-toastify'
import BarcodeScanner from './BarcodeScanner'
import ErrorBox from './ErrorBox'
import CONSTANT from '../constants'

const Body = () => {
    // const [qrData, setQrData] = useState("");
    const [qrData, setQrData] = useState('');
    const [voter, setVoter] = useState({ id: "", name: "", fatherName: "", gender: "", dob: "", booth: null, options: null, isOldVoterCard: false, uniqueKey: "", status: "" });
    const [fetchedVoter, setFetchVoter] = useState(true);
    const [errorMessage, setErrorMessage] = useState('')

    const fetchVoter = () => {
        if (qrData == "") return;

        const API = CONSTANT.qrDataSubmitApi;

        let formData = new FormData();
        formData.append('data', qrData);
        let params = { method: "POST", body: formData };


        fetch(API, params).then(data => data.text()).then((_rawData) => {
            let data;
            try {
                data = JSON.parse(_rawData);
                console.log(data);
            } catch (error) {
                toast.error("An unexpected data got from server");
                return;
            }

            if (data.status == 'error') {
                setErrorMessage(() => "Invalid QR code");                
                return;
            }

            if (data.voterStatus == "banned") {
                setErrorMessage(() => "You are Banned from voting");
            } else if (data.voterStatus == "dead") {
                setErrorMessage(() => "A Dead voter can't give vote");
            } else if (data.voterStatus == "active" && data.isOldVoterCard) {
                setErrorMessage(() => "You are using an older version of your voter card. Please use the latest one");
            }

            let voterData = {
                id: data.id,
                name: data.name,
                fatherName: data.fatherName,
                gender: data.gender,
                dob: data.dob,
                isOldVoterCard: data.isOldVoterCard,
                uniqueKey: data.uniquekey,
                status: data.voterStatus,
                options: data.options,
                booth: null,
            }

            if (data.voterStatus == 'active') {
                voterData['booth'] = {
                    name: data.boothName,
                    code: data.boothCode,
                    area: data.boothArea,
                    status: data.boothStatus,
                };
                voterData['options'] = data.options;
            }

            setVoter(() => { return voterData });

            if (voter.id !== "")
                toast.success("VOTER IS VERIFIED SUCCESSFULLY");
        }).catch((error) => {
            toast.error("An error happen in fetching data");
            return;
        })
    }

    useEffect(() => {
        fetchVoter();
    }, [qrData])

    // useEffect(() => {
    //     if (qrData != "")
    //         fetchVoter();

    // }, [qrData])


    return (
        <div className="container">
            <h2 className='text-light text-center my-4 p-1 bg-primary rounded'>Voting Page</h2>
            {
                (errorMessage != "") &&
                <ErrorBox errorMessage={errorMessage} />
            }

            <BarcodeScanner qrData={qrData} setQrData={setQrData} />
            < VoterDetails qrData={qrData} voter={voter} />

            {
                (voter.booth !== null) &&
                <VotingBox voter={voter} />
            }
        </div>
    )
}

export default Body