import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { useTranslation } from "react-i18next";
import "./CardWrapper.css";

const CarDetail = () => {
  const [car, setCar] = useState(null);
  const { t, i18n } = useTranslation();
  const { carId } = useParams();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const imgDisplayRef = useRef(null);
  const languageKey = i18n.language.split("-")[0];

  const handleButtonClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prevIndex) => (prevIndex + 1) % car.images.length);
  };

  const handlePrevImage = () => {
    setSelectedImageIndex(
      (prevIndex) => (prevIndex - 1 + car.images.length) % car.images.length
    );
  };

  const handleThumbnailClick = (index, event) => {
    event.preventDefault();
    setSelectedImageIndex(index);
  };

  const toggleFullScreen = () => {
    if (imgDisplayRef.current) {
      const requestFullScreen =
        imgDisplayRef.current.requestFullscreen ||
        imgDisplayRef.current.mozRequestFullScreen ||
        imgDisplayRef.current.webkitRequestFullscreen ||
        imgDisplayRef.current.msRequestFullscreen;
      const exitFullScreen =
        document.exitFullscreen ||
        document.mozCancelFullScreen ||
        document.webkitExitFullscreen ||
        document.msExitFullscreen;

      if (
        !document.fullscreenElement &&
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement &&
        !document.msFullscreenElement
      ) {
        requestFullScreen.call(imgDisplayRef.current);
      } else {
        exitFullScreen.call(document);
      }
    }
  };

  useEffect(() => {
    const fetchCar = async () => {
      const carDocRef = doc(db, "cars", carId);
      const carDoc = await getDoc(carDocRef);

      if (carDoc.exists()) {
        setCar({ id: carDoc.id, ...carDoc.data() });
      } else {
        console.log("No such car!");
      }
    };

    fetchCar();
  }, [carId, i18n.language]);

  if (!car) {
    return <div>Loading...</div>;
  }

  return (
    <section className="card-wrapper">
      <div className="card">
        <div className="product-imgs">
          <div className="img-display" ref={imgDisplayRef}>
            <button onClick={handlePrevImage} className="img-nav prev">
              &#10094;
            </button>
            <img
              src={car.images[selectedImageIndex]}
              alt="Car Display"
              className="img-showcase"
              onClick={toggleFullScreen}
            />
            <button onClick={handleNextImage} className="img-nav next">
              &#10095;
            </button>
            <button onClick={toggleFullScreen} className="fullscreen-toggle">
              {document.fullscreenElement ? "[FS]" : "[FS]"}
            </button>
          </div>
          <div className="img-select">
            {car.images.map((image, index) => (
              <div className="img-item" key={index}>
                <a
                  href="#"
                  onClick={(event) => handleThumbnailClick(index, event)}
                >
                  <img src={image} alt={`Image ${index}`} data-index={index} />
                </a>
              </div>
            ))}
          </div>
          <br></br>

          <div className="buttons">
            <button
              className={`button call-now ${isExpanded ? "expanded" : ""}`}
              onClick={handleButtonClick}
            >
              {isExpanded ? (
                <>
                  <div className="contact-info">{t("buttons.callNow")}</div>
                  <div className="contact-info">{t("buttons.contact")}</div>
                  <div className="contact-info">{t("buttons.email")}</div>
                </>
              ) : (
                <span>{t("buttons.callNow")}</span>
              )}
            </button>
          </div>
        </div>
        <div className="product-content">
          <h2 className="product-title">{car.name}</h2>
          <div className="product-detail">
            <h2>{t("buttons.about this vehicle")}</h2>
            <p>{car.description[languageKey] || car.description.en}</p>
            <ul>
              <li>
                <span className="detail-name">{t("vehicle_Details.Year")}</span>
                <span className="detail-info">{car.year}</span>
              </li>
              <li>
                <span className="detail-name">
                  {t("vehicle_Details.Kilometers")}
                </span>
                <span className="detail-info">{car.kilometers}</span>
              </li>
              <li>
                <span className="detail-name">
                  {t("vehicle_Details.Motor")}
                </span>
                <span className="detail-info">{car.motor}</span>
              </li>
              <li>
                <span className="detail-name">
                  {t("vehicle_Details.Transmission")}
                </span>
                <span className="detail-info">
                  {car.transmission[languageKey] || car.transmission.en}
                </span>
              </li>
              <li>
                <span className="detail-name">
                  {t("vehicle_Details.Engine Type")}
                </span>
                <span className="detail-info">
                  {car.engine_type[languageKey] || car.engine_type.en}
                </span>
              </li>
              <li>
                <span className="detail-name">{t("vehicle_Details.Fuel")}</span>
                <span className="detail-info">
                  {car.fuel_type[languageKey] ||
                    car.fuel_type[languageKey] ||
                    car.fuel_type.en}
                </span>
              </li>
              <li>
                <span className="detail-name">{t("vehicle_Details.Type")}</span>
                <span className="detail-info">{car.car_type}</span>
              </li>
              <li>
                <span className="detail-name">
                  {t("vehicle_Details.Seats")}
                </span>
                <span className="detail-info">{car.seats}</span>
              </li>
              <li>
                <span className="detail-name">
                  {t("vehicle_Details.Doors")}
                </span>
                <span className="detail-info">{car.doors}</span>
              </li>
            </ul>
          </div>
          <div className="product-price">
            <p className="new-price">
              <span>{car.price[languageKey] || car.price.en}</span>
            </p>
          </div>
          <br></br>
        </div>
      </div>
    </section>
  );
};

export default CarDetail;
