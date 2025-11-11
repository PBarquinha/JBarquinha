import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './hero.css';
import { useHistory } from 'react-router-dom';

function Hero() {
    const { t, ready } = useTranslation(); // ensures translation is loaded
    const history = useHistory();

    const handleCarPortfolioClick = () => {
        history.push('/vehicles');
    };

    const yOffset = -150;

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
        const heroLinks = document.querySelectorAll('.hero a[href^="#"]');
        heroLinks.forEach(link => {
            link.addEventListener('click', smoothScrollWithOffset);
        });

        return () => {
            heroLinks.forEach(link => {
                link.removeEventListener('click', smoothScrollWithOffset);
            });
        };
    }, []);

    // Wait for translations to be ready before rendering (improves LCP + prevents FOUC)
    if (!ready) return null;

    return (
        <div className="hero vh-100 d-flex align-items-center" id="hero">
            <div className="container">
                <div className="row">
                    <div className="col-lg-7 mx-auto text-center">
                        <h1 className="display-4 text-white animate__animated animate__fadeIn">
                            {t('hero.title')}
                        </h1>
                        <p className="text-white my-3 animate__animated animate__fadeIn animate__delay-0_3s">
                            {t('hero.subtitle')}
                        </p>
                        <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap">
                            <a
                                href="#vehicles"
                                className="btn btn-outline-light animate__animated animate__fadeIn animate__delay-0_3s"
                                onClick={smoothScrollWithOffset}
                            >
                                {t('hero.newArrivalsBtn')}
                            </a>
                            <button
                                onClick={handleCarPortfolioClick}
                                className="btn btn-outline-light animate__animated animate__fadeIn animate__delay-0_3s"
                                id="carPortfolioButton"
                            >
                                {t('hero.carPortfolioBtn')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Hero;

