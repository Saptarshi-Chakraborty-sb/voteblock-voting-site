import { useEffect, useState } from 'react';
import '../styles/VoterDetails.css'
import VotingOption from './VotingOption'

const VotingBox = ({ voter, setVoter }) => {
    const [option, setoption] = useState(null);
    const [message, setMessage] = useState("");

    const submitVote = () => {
        if (voter.status !== 'active' || option === "" || voter.booth.status !== 'active') return;
        let voteData = `${voter.uniqueKey}-${voter.booth.code}-${option.code}`;

        const message = `Your vote for ${option.name} (${option.code}) from ${voter.booth.name} (${voter.booth.code}) is submitted successfully`

        console.log(message);
        setMessage(() => message);

        // TODO: reset the voter data
    }

    useEffect(() => {
        console.log(option)
    }, [option])


    return (
        <>
            {
                (message === "") &&
                <div className='card my-4'>
                    {
                        (voter.booth.status == 'active') ?
                            <h2 className="title">Availavle Options for Your Booth</h2>
                            : (voter.booth.status == 'banned') ?
                                <h2 className="title">Your Booth is Banned for Some Reason</h2>
                                :
                                <h2 className="title">Your Booth is Closed for Some Reason</h2>
                    }

                    {
                        (voter.booth.status == 'active') ||
                        <p className='text-warning text-center'>No Option available for this Booth</p>
                    }

                    <div>
                        {(voter.booth.status == 'active' && message === "") &&
                            voter.options.map((item) => {
                                return <VotingOption key={item.code} item={item} setOption={setoption} />
                            })}
                    </div>

                    {
                        (voter.booth.status == 'active' || voter.booth.status == "") &&
                        <button onClick={submitVote} className="cbtn mt-3">Submit</button>
                    }
                </div >
            }

            {/* Set message after submitting */}
            {
                (message !== "") &&
                <div className='card my-4 bg-success'>
                    <h4 className='text-center text-light mb-0'>{message}</h4>
                </div>
            }
        </>
    )
}

export default VotingBox