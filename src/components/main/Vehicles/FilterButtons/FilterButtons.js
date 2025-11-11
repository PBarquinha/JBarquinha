import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../../firebase'; 
import './FilterButtons.css'; 
import { useTranslation } from 'react-i18next';

const FilterButtons = ({ totalCars, onFilterChange, onBrandChange, selectedBrand }) => {
    const [brands, setBrands] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const { t } = useTranslation();

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const carsCollection = collection(db, 'cars');
                const carsSnapshot = await getDocs(carsCollection);
                const fetchedBrands = new Set(carsSnapshot.docs.map(doc => doc.data().brand));
                setBrands([...fetchedBrands]);
            } catch (error) {
                console.error("Error fetching brands: ", error);
            }
        };

        fetchBrands();
    }, []);

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
        onFilterChange(event.target.value);
    };

    const handleBrandSelection = (event) => {
        const brand = event.target.value;
        onBrandChange(brand);
    };

    return (
        <div className="filter-section">
            <span>{t('FilterButtons.Total')} {totalCars} {t('FilterButtons.Cars')}</span>
            <div className="dropdowns-container">

                <select id="brand" value={selectedBrand} onChange={handleBrandSelection}>
                    <option value="">{t('FilterButtons.AllBrands')}</option>
                    {brands.map((brand, index) => (
                        <option key={index} value={brand}>{brand}</option>
                    ))}
                </select>
                <select id="sort" value={selectedOption} onChange={handleOptionChange}>
                    <option value="marca-az">{t('FilterButtons.Brand A-Z')}</option>
                    <option value="marca-za">{t('FilterButtons.Brand Z-A')}</option>
                    <option value="preco-asc">{t('FilterButtons.Price ASC')}</option>
                    <option value="preco-desc">{t('FilterButtons.Price DESC')}</option>
                    <option value="ano-asc">{t('FilterButtons.Year ASC')}</option>
                    <option value="ano-desc">{t('FilterButtons.Year DESC')}</option>
                </select>
            </div>

        </div>
    );
};

export default FilterButtons;


