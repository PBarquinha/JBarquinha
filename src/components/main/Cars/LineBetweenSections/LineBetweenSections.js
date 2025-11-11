import React from 'react';
import logo from '../../../../Website_Images/Icons/logo.png';
import './LineBetweenSections.css';


const LineBetweenSections = () => {
    return (
        <div className="line-between-sections">
            <div className="logo-overlay">
                <img src={logo} alt="Logo" />
            </div>
        </div>
    );
}

export default LineBetweenSections;
