import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { collection, getDocs, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import "./AdminCarsList.css";
import { Link } from "react-router-dom";

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

                                {/* ✅ Redirect to edit page */}
                                <Link to={`/admin/edit/${car.id}`} className="edit-btn">
                                    Edit
                                </Link>

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
