import React, { useEffect, useState } from 'react';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import Slider from 'react-slick';
import './LogoFilter.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const LogoFilter = ({ setBrandFilter }) => {
    const [logos, setLogos] = useState([]);
    const storage = getStorage();
    const [selectedBrand, setSelectedBrand] = useState(''); 
    const [totalCars, setTotalCars] = useState(0); 


    useEffect(() => {
        const fetchLogos = async () => {
            const logosListRef = ref(storage, 'Website_Img/Logos');
            try {
                const snapshot = await listAll(logosListRef);
                const logoData = await Promise.all(snapshot.items.map(async (itemRef) => {
                    const url = await getDownloadURL(itemRef);
                    return {
                        name: itemRef.name.split('.')[0], 
                        url: url
                    };
                }));
                console.log('Logos fetched:', logoData);
                setLogos(logoData);
            } catch (error) {
                console.error("Error fetching brand logos: ", error);
            }
        };

        fetchLogos();
    }, []);



    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 7,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 768, 
                settings: {
                    dots: false,
                    infinite: true,
                    speed: 500,
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    autoplay: true,
                    autoplaySpeed: 3000,
                }
            },
        ]
    };


    return (
        <div className="logo-slider">
            <Slider {...settings}>
                {logos.map((logo, index) => (
                    <div
                        key={index}
                        onClick={() => {
                            if (selectedBrand === logo.name) {
                                setSelectedBrand(''); 
                                setBrandFilter(''); 
                            } else {
                                setSelectedBrand(logo.name);
                                setBrandFilter(logo.name);
                            }
                        }}
                        className={`logo-item ${selectedBrand === logo.name ? 'selected' : ''}`}
                    >
                        <img src={logo.url} alt={logo.name} style={{ width: '100%' }} />
                        <div className={`overlay ${selectedBrand !== logo.name ? 'show' : ''}`}></div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default LogoFilter;


