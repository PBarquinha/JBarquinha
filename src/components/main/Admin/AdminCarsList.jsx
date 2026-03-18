import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { collection, getDocs, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import "./AdminCarsList.css";
import { Link } from "react-router-dom";

// ZIP libraries
import JSZip from "jszip";
import { saveAs } from "file-saver";

const AdminCarsList = () => {
    const [cars, setCars] = useState([]);

    // FETCH CARS FROM FIRESTORE
    useEffect(() => {
        const fetchCars = async () => {
            const carsRef = collection(db, "cars");
            const q = query(carsRef, orderBy("year", "desc"));
            const snapshot = await getDocs(q);

            const carList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setCars(carList);
        };

        fetchCars();
    }, []);

    // DELETE CAR
    const deleteCar = async (id) => {
        if (!window.confirm("Are you sure you want to delete this car?")) return;

        try {
            await deleteDoc(doc(db, "cars", id));
            setCars((prev) => prev.filter((car) => car.id !== id));
        } catch (error) {
            console.error("Error deleting:", error);
            alert("Could not delete car.");
        }
    };

    // DOWNLOAD ALL IMAGES AS A ZIP FILE
    const downloadImages = async (car) => {
    if (!car || !car.images || car.images.length === 0) {
        alert("No images found for this car.");
        return;
    }

    const zip = new JSZip();
    const folder = zip.folder(car.name.replace(/\s+/g, "_"));

    for (let i = 0; i < car.images.length; i++) {
        const url = car.images[i];

        try {
            const img = new Image();
            img.crossOrigin = "anonymous"; // IMPORTANT
            img.src = url;

            await new Promise((resolve, reject) => {
                img.onload = () => resolve();
                img.onerror = (err) => reject(err);
            });

            // Draw image into a canvas
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);

            // Convert to blob
            const blob = await new Promise((resolve) =>
                canvas.toBlob(resolve, "image/png")
            );

            folder.file(`image_${i + 1}.png`, blob);

        } catch (err) {
            console.error("Error processing image:", err);
        }
    }

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `${car.name.replace(/\s+/g, "_")}_images.zip`);
};


    return (
        <div className="admin-cars-container">
            <h1>Carros na Base de Dados</h1>

            <Link to="/admin/add-car" className="add-car-btn">
                + Adicionar Novo Carro
            </Link>

            {cars.length === 0 ? (
                <p>No cars found.</p>
            ) : (
                <div className="cars-list">
                    {cars.map((car) => (
                        <div className="car-item" key={car.id}>

                            <img src={car.image_no_background} alt={car.name} className="car-img" />

                            <div className="car-info">
                                <h3>{car.name}</h3>
                                <p><strong>Brand:</strong> {car.brand}</p>
                                <p><strong>Year:</strong> {car.year}</p>
                                <p><strong>Price:</strong> {car.price?.pt || "N/A"}</p>
                            </div>

                            <div className="car-actions">
                                <Link to={`/admin/edit/${car.id}`} className="edit-btn">
                                    Edit
                                </Link>

                                <button
                                    className="download-btn"
                                    onClick={() => downloadImages(car)}
                                >
                                    Download Images
                                </button>

                                <button
                                    className="delete-btn"
                                    onClick={() => deleteCar(car.id)}
                                >
                                    Delete
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminCarsList;
