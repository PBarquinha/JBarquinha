import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import './OtherSuggestions.css';
import { useHistory } from 'react-router-dom';

const CarDetail = () => {
    const [randomCars, setRandomCars] = useState([]);
    const { t, i18n } = useTranslation();
    const { carName } = useParams();
    const history = useHistory();
    const languageKey = i18n.language.split('-')[0];

    useEffect(() => {
        const fetchRandomCars = async () => {
            const carsCollection = collection(db, 'cars');
            const carsSnapshot = await getDocs(carsCollection);
            let carsList = carsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            carsList.sort(() => 0.5 - Math.random());
            const randomCars = carsList.slice(0, 3);
            setRandomCars(randomCars);
        };

        fetchRandomCars();
    }, [languageKey]);

    const handleDetailsClick = (carId) => {
        history.push(`../../car/${carId}`);
        window.scrollTo(0, 0);
    };

    return (
        <section className="featured1" id="featured">
            <h1 className="heading"> <span>{t('Suggestions.Other')}</span> {t('Suggestions.Suggestions')}</h1>
            <div className="featured-slider">
                {randomCars.map((car, index) => (
                    <div key={index} className="box1">
                        <div onClick={() => handleDetailsClick(car.id)} style={{ cursor: 'pointer' }}>
                            <img src={car.image_no_background} alt={car.name} />
                        </div>
                        <div className="content">
                            <h3>{car.name}</h3>
                            <div className="circle-info">
                                <div className="circle">
                                    <i className="fas fa-circle"></i>
                                    <span>{car.year}</span>
                                </div>
                                <div className="circle">
                                    <i className="fas fa-circle"></i>
                                    <span>{car.transmission[languageKey] ?? 'Unavailable'}</span>
                                </div>
                                <div className="circle">
                                    <i className="fas fa-circle"></i>
                                    <span>{car.motor}</span>
                                </div>
                            </div>
                            <div className="price">                  {car.price[languageKey]}
                            </div>
                            <a href="#hero" className="btn" onClick={() => handleDetailsClick(car.id)}>{t('Suggestions.More Info')}</a>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CarDetail;
