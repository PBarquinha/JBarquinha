import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './Footer.css';
import { useHistory } from 'react-router-dom';

const Footer = () => {
    const { t } = useTranslation();
    const history = useHistory(); 
    const handleDetailsClick = () => {
        history.push(`/vehicles`);
    };
    const smoothScrollWithOffset = (e) => {
        const yOffset = -200; 
        const targetId = e.currentTarget.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
        e.preventDefault();
    };

    useEffect(() => {
        const footerLinks = document.querySelectorAll('.footer a[href^="#"]');
        footerLinks.forEach(link => {
            link.addEventListener('click', smoothScrollWithOffset);
        });

        return () => {
            footerLinks.forEach(link => {
                link.removeEventListener('click', smoothScrollWithOffset);
            });
        };
    }, []);


    return (
        <footer className="footer" id="footer">
            <section className="box-container">
            <div className="box1">
                    <h3>{t('footer.quickLinks')}</h3>
                    <a href="#hero" onClick={smoothScrollWithOffset}> <i className="fas fa-arrow-right"></i> {t('footer.home')} </a>
                    <a href="#vehicles" onClick={smoothScrollWithOffset}> <i className="fas fa-arrow-right"></i> {t('footer.newArrivals')} </a>
                    <a href="#services" onClick={smoothScrollWithOffset}> <i className="fas fa-arrow-right"></i> {t('footer.services')} </a>
                    <a onClick={() => handleDetailsClick()}> <i className="fas fa-arrow-right"></i> {t('footer.vehicles')} </a>
                    <a href="#about-us" onClick={smoothScrollWithOffset}> <i className="fas fa-arrow-right"></i> {t('header.about-us')} </a>
                    <a href="#contact" onClick={smoothScrollWithOffset}> <i className="fas fa-arrow-right"></i> {t('footer.contact')} </a>
                </div>

                <div className="box">
                    <h3>{t('footer.contactInfo')}</h3>
                    <a href="#footer"> <i className="fas fa-phone"></i> +351 966 055 016 </a>
                    <a href="#footer"> <i className="fas fa-envelope"></i> JBarquinha@JBarquinha.com </a>
                    <a href="#footer"> <i className="fas fa-map-marker-alt"></i> Rua D. João IV, 691, 4000-303 PORTO</a>
                </div>

                <div className="box">
                    <h3>{t('footer.socialMedia')}</h3>
                    <a href="https://www.facebook.com/JBarquinha2020/" target="_blank" rel="noopener noreferrer"> <i className="fab fa-facebook-f"></i> Facebook </a>
                    <a href="https://www.instagram.com/j.barquinha/" target="_blank" rel="noopener noreferrer"> <i className="fab fa-instagram"></i> Instagram </a>
                    <a href="https://api.whatsapp.com/send?phone=351966055016" target="_blank" rel="noopener noreferrer"> <i className="fab fa-whatsapp"></i> Whatsapp </a>
                </div>
            </section>
        </footer>
    );
};

export default Footer;
