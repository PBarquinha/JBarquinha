import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import logo from '../../../../Website_Images/Icons/logo.webp';
import './header.css';
import { useHistory } from 'react-router-dom'; 

function Header() {
    const { t, i18n } = useTranslation();
    const [isActive, setIsActive] = useState(false);
    const history = useHistory(); 
    
    const handleLogoClick = () => {
        history.push('/'); // Navigate to the homepage
    };
    const changeLanguage = (language) => {
        i18n.changeLanguage(language);
    };

    const toggleMenu = () => {
        setIsActive(!isActive);
    };
    const handleDetailsClick = () => {
        history.push(`/vehicles`);
    };
    const yOffset = -100;

    const smoothScrollWithOffset = (e) => {
        const targetId = e.currentTarget.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
        e.preventDefault();
    };

    useEffect(() => {
        const navLinks = document.querySelectorAll('.navbar a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', smoothScrollWithOffset);
        });

        return () => {
            navLinks.forEach(link => {
                link.removeEventListener('click', smoothScrollWithOffset);
            });
        };
    }, []);

    return (
        <header className="header">
            <section className="flex">
                {}
                <div id="menu-btn" className={`fas fa-bars ${isActive ? 'fa-times' : ''}`} onClick={toggleMenu}></div>
                <div className="logo" onClick={handleLogoClick}>
                    <img src={logo} alt="Logo" />
                </div>
                {}
                <nav className={`navbar ${isActive ? 'active' : ''}`} id="navbar">
                    <a href="../../#header">{t('header.home')}</a>
                    <a href="../../#services">{t('header.services')}</a>
                    <a  onClick={() => handleDetailsClick()}>{t('header.vehicles')}</a>
                    <a href="../../#contact">{t('header.contact')}</a>
                    <div className="flag-container">
                        <div className="flag">
                            <span
                                className={`language-option ${i18n.language === 'pt' ? 'active-text' : ''}`}
                                onClick={() => changeLanguage('pt')}
                            >
                                PT
                            </span>
                        </div>
                        <div className="flag">
                            <span className="language-separator"> | </span>
                        </div>
                        <div className="flag flag-english">
                            <span
                                className={`language-option ${i18n.language === 'en' ? 'active-text' : ''}`}
                                onClick={() => changeLanguage('en')}
                            >
                                EN
                            </span>
                        </div>
                    </div>
                </nav>
                <div id="language-selector" className="flag-container">
                    <div className="flag flag-portuguese">
                        <span
                            className={`language-option ${i18n.language === 'pt' ? 'active-text' : ''}`}
                            onClick={() => changeLanguage('pt')}
                        >
                            PT
                        </span>
                    </div>
                    <div className="flag">
                        <span className="language-separator"> | </span>
                    </div>
                    <div className="flag flag-english">
                        <span
                            className={`language-option ${i18n.language === 'en' ? 'active-text' : ''}`}
                            onClick={() => changeLanguage('en')}
                        >
                            EN
                        </span>
                    </div>
                </div>
            </section>
        </header>
    );
}

export default Header;


