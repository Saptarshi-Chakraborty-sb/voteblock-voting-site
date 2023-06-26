import React from 'react'
import '../styles/VoterDetails.css'

const VoterBox = ({ voter }) => {
    return (
        <>
            {
                (voter.id != "") &&
                <div className="card my-4">
                    <h1 className="title">Your Personal Details</h1>
                    <p><strong>Voter ID : </strong>{voter.id}</p>
                    <p><strong>Name : </strong>{voter.name}</p>
                    <p><strong>Father's Name : </strong>{voter.fatherName}</p>

                    <p><strong>Gender : </strong>
                        {
                            (voter.gender == 'm') ? "Male" :
                                (voter.gender == 'f') ? "Female" :
                                    (voter.gender == 't') ? "Transgender" : "Others"

                        }
                    </p>

                    <p><strong>Date of Birth : </strong>{voter.dob}</p>
                    <p><strong>Booth : </strong>{voter.booth.name} ({voter.booth.area})</p>

                    <p><strong>Status : </strong>
                        {
                            (voter.status === 'active') &&
                            <span className="badge rounded-pill text-bg-success">Active</span>
                        }{
                            (voter.status === 'banned') &&
                            <span className="badge rounded-pill text-bg-warning">Banned</span>
                        }{
                            (voter.status === 'dead') &&
                            <span className="badge rounded-pill text-bg-danger">Dead</span>
                        }
                    </p>
                    
                </div>
            }
        </>
    )
}

export default VoterBox