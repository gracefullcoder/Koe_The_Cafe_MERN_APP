import React from 'react'
import { NavLink } from 'react-router-dom';
function CustomizerBox({ title, iconClass, buttonText,link }) {
    return (
        <div className="option">
            <i className={`${iconClass} customizer-icon`} />
            <h1 className='customize-title'>
                {title}
            </h1>
            <NavLink to ={link} className='btn btn-secondary'>
                <span className='text text-1'>{buttonText}</span>
                <span className='text text-2'>Let's Go</span>
            </NavLink>
        </div>
    )
}

export default CustomizerBox;