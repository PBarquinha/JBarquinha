import React from 'react';
import './AboutUs.css'; 
import { useTranslation } from 'react-i18next';
import img from '../../../../Website_Images/Heros_Banners/Untitled design (5).png'
import { useHistory } from 'react-router-dom'; 


function AboutUs() {
    const { t } = useTranslation();
    const history = useHistory(); 

    const handleCarPortfolioClick = () => {
        history.push('/vehicles');
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 0); 
    };
    return (
        <div className="about-us" id='about-us'>
            <div className="content-about">
                <div className="image-container">
                    <img src={img} alt="About Us" />
                </div>
                <div className="text-container">
                    <h3 className="about-title">{t('header.about-us')}</h3>
                    <br></br>
                    <br></br>
                    <br></br>
                    <p>{t('About-Us.text1')}</p>
                    <p>{t('About-Us.text2')}</p>
                    <br></br>
                    <br></br>
                    <a onClick={handleCarPortfolioClick} href="#classics">{t('About-Us.button')}</a>
                </div>
            </div>
        </div>
    );
}

export default AboutUs;
