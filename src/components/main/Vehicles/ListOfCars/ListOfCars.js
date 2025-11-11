import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { useTranslation } from 'react-i18next';
import './ListOfCars.css';
import LogoFilter from '../LogoFilter/LogoFilter';
import FilterButtons from '../FilterButtons/FilterButtons';
import { useHistory } from 'react-router-dom';


const ListOfCars = () => {
    const [cars, setCars] = useState([]);
    const [brands, setBrands] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('');
    const [brandCarCount, setBrandCarCount] = useState(0);
    const { t, i18n } = useTranslation();
    const history = useHistory();
    const languageKey = i18n.language.split('-')[0];

    useEffect(() => {
        const fetchCars = async () => {
            const carsCollection = collection(db, 'cars');
            const carsSnapshot = await getDocs(carsCollection);
            const carsList = carsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCars(carsList);
            const uniqueBrands = new Set(carsList.map(car => car.brand));
            setBrands([...uniqueBrands]);
        };

        fetchCars();
    }, [languageKey]);

    useEffect(() => {
        const filteredCars = selectedBrand
            ? cars.filter(car => car.brand === selectedBrand)
            : cars;
        setBrandCarCount(filteredCars.length);
    }, [selectedBrand, cars]);

    const handleSetFilter = (filterOption) => {
        setSelectedFilter(filterOption);
    };

    const handleBrandChange = (brandName) => {
        setSelectedBrand(brandName);
    };

    const handleDetailsClick = (carId) => {
        history.push(`/car/${carId}`);
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 0); // This delay ensures the scroll happens after navigation
    };



    const handleSetBrandFilter = (brandName) => {
        if (selectedBrand === brandName) {
            setSelectedBrand('');
        } else {
            setSelectedBrand(brandName);
        }
    };

    const applyFilters = () => {
        let filteredCars = [...cars];

        if (selectedBrand) {
            filteredCars = filteredCars.filter(car => car.name.includes(selectedBrand));
        }

        const extractPriceValue = (priceStr) => {
            if (priceStr === 'Consult' || priceStr === 'Consulte') {
                return Number.MAX_VALUE;
            }
            return parseFloat(priceStr.replace(/[^0-9.]/g, ''));
        };

        switch (selectedFilter) {
            case 'marca-az':
                filteredCars.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'marca-za':
                filteredCars.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'preco-asc':
                filteredCars.sort((a, b) => extractPriceValue(a.price[i18n.language]) - extractPriceValue(b.price[i18n.language]));
                break;
            case 'preco-desc':
                filteredCars.sort((a, b) => extractPriceValue(b.price[i18n.language]) - extractPriceValue(a.price[i18n.language]));
                break;
            case 'ano-asc':
                filteredCars.sort((a, b) => a.year - b.year);
                break;
            case 'ano-desc':
                filteredCars.sort((a, b) => b.year - a.year);
                break;
        }

        return filteredCars;
    };


    const filteredAndSortedCars = applyFilters();


    const filteredCars = selectedBrand
        ? cars.filter(car => car.name.startsWith(selectedBrand))
        : cars;


    return (
        <section className="featured" id="featured">
            <LogoFilter setBrandFilter={handleBrandChange} />
            <FilterButtons
                totalCars={brandCarCount}
                onFilterChange={handleSetFilter}
                brands={brands}
                selectedBrand={selectedBrand}
                onBrandChange={handleBrandChange}
            />
            <div className="featured-slider">
                {filteredAndSortedCars.map((car, index) => (
                    <div className="box" key={index}>
                        <div onClick={() => handleDetailsClick(car.id)} style={{ cursor: 'pointer' }}>
                            <img src={car.image_no_background} alt={car.name} />
                        </div>
                        <div className='content'>
                            <br></br>
                            <h3>{car.name}</h3>
                            <div className="circle-info">
                                <div className="circle">
                                    <i className="fas fa-circle"></i>
                                    <span> {car.year}</span>
                                </div>
                                <div className="circle">
                                    <i className="fas fa-circle"></i>
                                    <span> {car.transmission?.[languageKey]}</span>
                                </div>
                                <div className="circle">
                                    <i className="fas fa-circle"></i>
                                    <span>{car.motor}</span>
                                </div>
                            </div>
                            <div className="price">
                                {car.price[languageKey]}
                            </div>
                            <a className="btn" onClick={() => handleDetailsClick(car.id)}>{t('listOfCars.detailsButton')}</a>
                        </div>
                    </div>
                ))}
            </div>
        </section>



    );
};

export default ListOfCars;

