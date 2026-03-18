import React, { useEffect, useState } from "react";
import { db, storage } from "../../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { useParams, useHistory } from "react-router-dom";

import {
    DndContext,
    closestCenter
} from "@dnd-kit/core";

import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
    useSortable
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import OpenAI from "openai";
import "./AdminEditCar.css";

const client = new OpenAI({
    apiKey: "",
    dangerouslyAllowBrowser: true,
});

// ⬇ SORTABLE ITEM COMPONENT
function SortableImage({ url, index, onRemove }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: url });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: "10px",
        background: "#f5f5f5",
        marginBottom: "10px",
        borderRadius: "6px",
        display: "flex",
        alignItems: "center",
        cursor: "grab",
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <img src={url} alt="" className="gallery-thumb" />
            <button className="remove-btn" onClick={() => onRemove(url)}>
                Remove
            </button>
        </div>
    );
}

export default function AdminEditCar() {
    const { id } = useParams();
    const history = useHistory();

    const [car, setCar] = useState(null);
    const [gallery, setGallery] = useState([]);
    const [newImages, setNewImages] = useState([]);

    // Load car data
    useEffect(() => {
        const load = async () => {
            const snap = await getDoc(doc(db, "cars", id));
            if (snap.exists()) {
                const data = snap.data();
                setCar(data);
                setGallery(data.images || []);
            }
        };
        load();
    }, [id]);

    // Auto-translate PT → EN
    useEffect(() => {
        if (!car) return;

        const translate = async () => {
            if (!car.description.pt.trim()) return;

            const response = await client.chat.completions.create({
                model: "gpt-4.1-mini",
                messages: [
                    {
                        role: "user",
                        content: `Translate to English:\n${car.description.pt}`,
                    },
                ],
            });

            setCar((prev) => ({
                ...prev,
                description: {
                    ...prev.description,
                    en: response.choices[0].message.content.trim(),
                },
            }));
        };

        translate();
    }, [car?.description?.pt]);

    if (!car) return <h2>Loading...</h2>;

    // FORM CHANGE HANDLER
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith("price_")) {
            setCar({
                ...car,
                price: { ...car.price, [name.split("_")[1]]: value },
            });
        } else if (name.startsWith("description_")) {
            setCar({
                ...car,
                description: { ...car.description, [name.split("_")[1]]: value },
            });
        } else if (name.startsWith("engine_")) {
            setCar({
                ...car,
                engine_type: { ...car.engine_type, [name.split("_")[1]]: value },
            });
        } else if (name.startsWith("fuel_")) {
            setCar({
                ...car,
                fuel_type: { ...car.fuel_type, [name.split("_")[1]]: value },
            });
        } else if (name.startsWith("transmission_")) {
            setCar({
                ...car,
                transmission: { ...car.transmission, [name.split("_")[1]]: value },
            });
        } else {
            setCar({ ...car, [name]: value });
        }
    };

    // DRAG DROP
    const onDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = gallery.indexOf(active.id);
        const newIndex = gallery.indexOf(over.id);

        setGallery((items) => arrayMove(items, oldIndex, newIndex));
    };

    // Remove image
    const removeImage = async (imgUrl) => {
        if (!window.confirm("Remove this image?")) return;

        try {
            const fileRef = ref(storage, imgUrl);
            await deleteObject(fileRef);
            setGallery((prev) => prev.filter((i) => i !== imgUrl));
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddImages = (e) => {
        setNewImages(Array.from(e.target.files));
    };

    // SAVE ALL CHANGES
    const saveChanges = async () => {
        try {
            let updatedGallery = [...gallery];

            // Upload new images
            for (let i = 0; i < newImages.length; i++) {
                const file = newImages[i];
                const path = `Website_Img/Cars_Imgs/${id}/${Date.now()}-${i}.png`;
                const fileRef = ref(storage, path);

                await uploadBytes(fileRef, file);
                const url = await getDownloadURL(fileRef);

                updatedGallery.push(url);
            }

            // Save EVERYTHING back to Firestore
            await updateDoc(doc(db, "cars", id), {
                ...car,
                images: updatedGallery,
            });

            alert("Car updated successfully!");
            history.push("/admin/cars");

        } catch (err) {
            console.error(err);
            alert("Error saving changes.");
        }
    };

    return (
        <div className="edit-car-container">
            <h1>Edit Car — {car.name}</h1>

            {/* BASIC INFO */}
            <h2>Basic Info</h2>
            <div className="edit-grid">
                <label>Name</label>
                <input name="name" value={car.name} onChange={handleChange} />

                <label>Brand</label>
                <input name="brand" value={car.brand} onChange={handleChange} />

                <label>Year</label>
                <input name="year" value={car.year} type="number" onChange={handleChange} />

                <label>Kilometers</label>
                <input name="kilometers" value={car.kilometers} onChange={handleChange} />

                <label>Motor</label>
                <input name="motor" value={car.motor} onChange={handleChange} />

                <label>Seats</label>
                <input name="seats" type="number" value={car.seats} onChange={handleChange} />

                <label>Doors</label>
                <input name="doors" type="number" value={car.doors} onChange={handleChange} />

                <label>Car Type</label>
                <input name="car_type" value={car.car_type} onChange={handleChange} />
            </div>

            {/* PRICE */}
            <h2>Price</h2>
            <div className="edit-grid">
                <label>Price (PT)</label>
                <input name="price_pt" value={car.price.pt} onChange={handleChange} />

                <label>Price (EN)</label>
                <input name="price_en" value={car.price.en} onChange={handleChange} />
            </div>

            {/* DESCRIPTION */}
            <h2>Description</h2>
            <div className="edit-grid">
                <label>Description PT</label>
                <textarea
                    name="description_pt"
                    value={car.description.pt}
                    onChange={handleChange}
                ></textarea>

                <label>Description EN (auto)</label>
                <textarea
                    name="description_en"
                    readOnly
                    value={car.description.en}
                ></textarea>
            </div>

            {/* ENGINE */}
            <h2>Engine</h2>
            <div className="edit-grid">
                <label>Engine EN</label>
                <input
                    name="engine_en"
                    value={car.engine_type.en}
                    onChange={handleChange}
                />

                <label>Engine PT</label>
                <input
                    name="engine_pt"
                    value={car.engine_type.pt}
                    onChange={handleChange}
                />
            </div>

            {/* FUEL */}
            <h2>Fuel Type</h2>
            <div className="edit-grid">
                <label>Fuel EN</label>
                <input
                    name="fuel_en"
                    value={car.fuel_type.en}
                    onChange={handleChange}
                />

                <label>Fuel PT</label>
                <input
                    name="fuel_pt"
                    value={car.fuel_type.pt}
                    onChange={handleChange}
                />
            </div>

            {/* TRANSMISSION */}
            <h2>Transmission</h2>
            <div className="edit-grid">
                <label>Transmission EN</label>
                <input
                    name="transmission_en"
                    value={car.transmission.en}
                    onChange={handleChange}
                />

                <label>Transmission PT</label>
                <input
                    name="transmission_pt"
                    value={car.transmission.pt}
                    onChange={handleChange}
                />
            </div>

            {/* GALLERY */}
            <h2>Gallery (Drag to reorder)</h2>

            <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                <SortableContext items={gallery} strategy={verticalListSortingStrategy}>
                    {gallery.map((url, i) => (
                        <SortableImage key={url} url={url} index={i} onRemove={removeImage} />
                    ))}
                </SortableContext>
            </DndContext>

            <h3>Add More Images</h3>
            <input type="file" multiple accept="image/png" onChange={handleAddImages} />

            <button className="save-btn" onClick={saveChanges}>
                Save All Changes
            </button>
        </div>
    );
}
