import React from 'react'
import '../styles/VoterDetails.css'


const ErrorBox = ({ errorMessage }) => {
    // errorMessage = "A Banned Voter cannot give vote";
    return (
        <div className="card my-4 p-3" style={{ width: "fit-content", backgroundColor:"red" }}>
                <p className='m-0'>{errorMessage}</p>
        </div>
    )
}

export default ErrorBox