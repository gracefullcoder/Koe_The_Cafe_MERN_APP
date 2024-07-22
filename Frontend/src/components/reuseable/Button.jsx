import React from 'react'

function PrimaryButton({ text1, text2, fnx }) {
    return (
        <button className="btn btn-primary" onClick={fnx}>
            <span className="text text-1">{text1}</span>
            <span className="text text-2">{text2}</span>
        </button>
    )
}

function SecondaryButton({ text1, text2, fnx }) {
    return (
        <button className="btn btn-secondary" onClick={fnx}>
            <span className="text text-1">{text1}</span>
            <span className="text text-2">{text2}</span>
        </button>
    )
}

export { PrimaryButton, SecondaryButton }