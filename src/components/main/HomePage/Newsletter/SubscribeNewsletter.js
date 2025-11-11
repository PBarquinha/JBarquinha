import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './SubscribeNewsletter.css';


const SubscribeNewsletter = () => {
    const [email, setEmail] = useState('');
    const { t } = useTranslation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = "https://script.google.com/macros/s/AKfycbz9z2tPL2MmqQtNPjGC8yKAisXp7ywkOR2uCJ6qaCqI42lJkHvUKz5uUh7c_6pJQHrq/exec"; // Replace with your Google Script URL
        try {
            await fetch(`${url}?email=${email}`);
            alert(t('newsletter.thankYouMessage'));
            setEmail('');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="newsletter-container">
            <section className="newsletter">
                <h3>{t('newsletter.title')}</h3>
                <p>{t('newsletter.description')}</p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder={t('newsletter.emailPlaceholder')}
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input type="submit" value={t('newsletter.subscribeButton')} />
                </form>
            </section>
        </div>
    );
};

export default SubscribeNewsletter;
