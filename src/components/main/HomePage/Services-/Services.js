import React from 'react';
import { useTranslation } from 'react-i18next';
import './Services.css';

const Services = () => {
    const { t } = useTranslation();

    return (
        <section className="services" id="services">
            <div className="box-container">
                <div className="box">
                    <i className="fas fa-car"></i>
                    <h3>{t('services.classicsForSaleTitle')}</h3>
                    <p>{t('services.classicsForSaleDesc')}</p>
                </div>

                <div className="box">
                    <i className="fas fa-tools"></i>
                    <h3>{t('services.consignmentServicesTitle')}</h3>
                    <p>{t('services.consignmentServicesDesc')}</p>
                </div>

                <div className="box">
                    <i className="fas fa-headset"></i>
                    <h3>{t('services.consultTitle')}</h3>
                    <p>{t('services.consultDesc')}</p>
                </div>
            </div>
            <br /><br /><br />
        </section>
    );
};

export default Services;
