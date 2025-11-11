import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../../firebase';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import './TopPicks.css';
import { useHistory } from 'react-router-dom';

const TopPicks = () => {
    const [cars, setCars] = useState([]);
    const { t, i18n } = useTranslation();
    const swiperRef = useRef(null);
    const history = useHistory();

    const languageKey = i18n.language.split('-')[0];

    useEffect(() => {
        const fetchCars = async () => {
            const carsCollection = collection(db, 'cars');
            const carsSnapshot = await getDocs(carsCollection);
            let carsList = carsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            // Shuffle the array to get random cars
            for (let i = carsList.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [carsList[i], carsList[j]] = [carsList[j], carsList[i]];
            }

            // Select the first 7 cars
            carsList = carsList.slice(0, 7);
            setCars(carsList);
        };

        fetchCars();
    }, [languageKey]);

    const handleDetailsClick = (carId) => {
        history.push(`/car/${carId}`);
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 0); // This delay ensures the scroll happens after navigation
    };

    return (
        <section className="vehicles" id="vehicles">
            <h1 className="heading">{t('topPicks.heading')}</h1>

            {cars.length > 0 && (
                <Swiper
                    ref={swiperRef}
                    className="vehicles-slider"
                    grabCursor={true}
                    centeredSlides={true}
                    spaceBetween={20}
                    loop={true}
                    autoplay={{ delay: 5000, disableOnInteraction: true }}
                    pagination={{ clickable: true }}
                    slideToClickedSlide={true}
                    breakpoints={{
                        0: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 }
                    }}
                >
                    {cars.map((car, index) => (
                        <SwiperSlide key={index} className="box">
                            <img
                                src={car.image_no_background}
                                alt={car.name}
                            />
                            <div className="content">
                                <div className="price">{car.name}</div>
                                <p>
                                    <span className="fas fa-circle"></span> {car.year}
                                    <span className="fas fa-circle"></span> {car.transmission?.[languageKey]}
                                    <span className="fas fa-circle"></span> {car.motor}
                                </p>
                                <button onClick={() => handleDetailsClick(car.id)} className="btn">{t('topPicks.detailsButton')}</button>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </section>
    );
};

export default TopPicks;


