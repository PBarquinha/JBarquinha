import React from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faCar, faUsers } from '@fortawesome/free-solid-svg-icons';
import './Informations.css'; 

const Informations = () => {
    const { t } = useTranslation(); 

    const boxes = [
        { icon: faHome, number: '30+', text: t('infoSection.yearsExperience') },
        { icon: faCar, number: '500+', text: t('infoSection.carsSold') },
        { icon: faUsers, number: '400+', text: t('infoSection.happyClients') },
        { icon: faCar, number: '35+', text: t('infoSection.carsInStock') },
    ];

    return (
        <div className="icons-container">
            <section className="box-container">
                {boxes.map((box, index) => (
                    <div className="box" key={index}>
                        <FontAwesomeIcon icon={box.icon} />
                        <div className="content">
                            <h3>{box.number}</h3>
                            <p>{box.text}</p>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default Informations;

