import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import './ContactForm.css';
import 'react-phone-number-input/style.css';

const PhoneInput = lazy(() => import('react-phone-number-input'));

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [status, setStatus] = useState(null);
    const [showMap, setShowMap] = useState(false);
    const mapRef = useRef(null);
    const { t } = useTranslation();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handlePhoneChange = (phone) => {
        setFormData((prevData) => ({ ...prevData, phone }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = 'https://us-central1-jbarquinha-28a41.cloudfunctions.net/sendEmail';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setStatus('success');
                alert(t('contactForm.thankYouMessage'));
                setFormData({ name: '', email: '', phone: '', message: '' });
            } else {
                const errorText = await response.text();
                console.error('Form submission failed:', errorText);
                setStatus('error');
            }
        } catch (error) {
            console.error('Error:', error);
            setStatus('error');
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShowMap(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (mapRef.current) {
            observer.observe(mapRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section className="contact" id="contact">
            <h1 className="heading">{t('contactForm.title')}</h1>
            <div className="row">
                <div className="map-container" ref={mapRef}>
                    {showMap && (
                        <iframe
                            className="map"
                            src="https://maps.google.com/maps?q=Rua%20D.%20Jo%C3%A3o%20IV,%20691,%204000-303%20PORTO&amp;t=&amp;z=13&amp;ie=UTF8&amp;iwloc=&amp;output=embed"
                            allowFullScreen
                            loading="lazy"
                            title="Google Map"
                        />
                    )}
                </div>

                <form onSubmit={handleSubmit}>
                    <h3>{t('contactForm.header')}</h3>
                    <input
                        type="text"
                        name="name"
                        placeholder={t('contactForm.namePlaceholder')}
                        className="box"
                        required
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder={t('contactForm.emailPlaceholder')}
                        className="box"
                        required
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <div className="phone-container">
                        <Suspense fallback={<div>Loading phone input...</div>}>
                            <PhoneInput
                                international
                                defaultCountry="PT"
                                value={formData.phone}
                                onChange={handlePhoneChange}
                                className="my-phone-input PhoneInput"
                                required
                            />
                        </Suspense>
                    </div>
                    <textarea
                        name="message"
                        placeholder={t('contactForm.messagePlaceholder')}
                        className="box"
                        required
                        value={formData.message}
                        onChange={handleChange}
                    ></textarea>
                    <input type="submit" value={t('contactForm.submitButton')} className="btn" />
                </form>

                {status === 'success' && (
                    <p className="success-message">Email sent successfully!</p>
                )}
                {status === 'error' && (
                    <p className="error-message">Error sending email. Please try again later.</p>
                )}
            </div>
        </section>
    );
};

export default ContactForm;

