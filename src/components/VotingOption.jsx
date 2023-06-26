import React from 'react'

const VotingOption = ({ item, setOption }) => {
    return (
        <div onClick={() => setOption(() => item)} className="form-check">
            <input className="form-check-input" type="radio" name="votingOptions" id={`${item.code}-opt`} />
            <label className="form-check-label" htmlFor={`${item.code}-opt`}>
                {item.name} ({item.code})
            </label>
        </div>
    )
}

export default VotingOption