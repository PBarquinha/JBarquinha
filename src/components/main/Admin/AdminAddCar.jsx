import React, { useState, useEffect } from "react";
import { db, storage } from "../../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useHistory } from "react-router-dom";
import "./AdminAddCar.css";
import OpenAI from "openai";

const client = new OpenAI({
    apiKey: "",
    dangerouslyAllowBrowser: true,
});

const AdminAddCar = () => {
    const history = useHistory();

    const [carData, setCarData] = useState({
        name: "",
        brand: "",
        year: "",
        kilometers: "",
        motor: "",
        seats: "",
        doors: "",
        car_type: "",
        price_en: "",
        price_pt: "",
        description_en: "",
        description_pt: "",
        engine_en: "",
        engine_pt: "",
        fuel_en: "",
        fuel_pt: "",
        transmission_en: "",
        transmission_pt: "",
    });

    const [mainImage, setMainImage] = useState(null);
    const [galleryImages, setGalleryImages] = useState([]);

    const handleChange = (e) => {
        setCarData({ ...carData, [e.target.name]: e.target.value });
    };

    // -------------------------------------------
    // 🔄 AUTO TRANSLATE PT -> EN DESCRIPTION
    // -------------------------------------------
    useEffect(() => {
        const translate = async () => {
            if (!carData.description_pt.trim()) return;

            try {
                const response = await client.chat.completions.create({
                    model: "gpt-4.1-mini",
                    messages: [
                        { role: "user", content: `Translate to English:\n${carData.description_pt}` },
                    ],
                });

                setCarData((prev) => ({
                    ...prev,
                    description_en: response.choices[0].message.content.trim(),
                }));
            } catch (err) {
                console.error("Translation error", err);
            }
        };

        translate();
    }, [carData.description_pt]);

    // -------------------------------------------
    // 🚀 AI AUTOFILL 
    // -------------------------------------------
    const autoFillWithAI = async () => {
        if (!carData.name || !carData.year) {
            alert("Please enter NAME & YEAR first.");
            return;
        }

        try {
            const prompt = `
You are an expert in classic cars. Fill missing info with the STRICT format:

RETURN ONLY CLEAN JSON — NO markdown.

{
  "brand": "",
  "car_type": "",            // Use only: Sedan, Coupe, Cabrio, Hatchback, SUV, Pickup
  "motor": "",               // Format: "138 HP / 1605 cc"
  "doors": 0,
  "seats": 0,
  "kilometers": "N/A",
  "engine_en": "",           // Example: "Inline 4-cylinder"
  "engine_pt": "",
  "fuel_en": "",
  "fuel_pt": "",
  "transmission_en": "",     // Only "Manual" or "Automatic"
  "transmission_pt": "",
  "description_en": "",
  "description_pt": ""
}

Car:
Name: ${carData.name}
Year: ${carData.year}
`;

            const response = await client.chat.completions.create({
                model: "gpt-4.1-mini",
                messages: [{ role: "user", content: prompt }],
            });

            let content = response.choices[0].message.content
                .replace(/```json/gi, "")
                .replace(/```/g, "")
                .trim();

            let json;
            try {
                json = JSON.parse(content);
            } catch (err) {
                console.error("Bad JSON:", content);
                alert("AI returned invalid JSON");
                return;
            }

            setCarData((prev) => ({
                ...prev,
                brand: json.brand || prev.brand,
                car_type: json.car_type || prev.car_type,
                motor: json.motor || prev.motor,
                doors: json.doors || prev.doors,
                seats: json.seats || prev.seats,
                kilometers: json.kilometers || prev.kilometers,
                engine_en: json.engine_en || prev.engine_en,
                engine_pt: json.engine_pt || prev.engine_pt,
                fuel_en: json.fuel_en || prev.fuel_en,
                fuel_pt: json.fuel_pt || prev.fuel_pt,
                transmission_en: json.transmission_en || prev.transmission_en,
                transmission_pt: json.transmission_pt || prev.transmission_pt,
            }));

            alert("AI Auto-fill complete!");

        } catch (error) {
            console.error("AI Error:", error);
            alert("AI failed — see console");
        }
    };

    // -------------------------------------------
    // FILE UPLOADER
    // -------------------------------------------
    const uploadFile = async (file, path) => {
        const fileRef = ref(storage, path);
        await uploadBytes(fileRef, file);
        return await getDownloadURL(fileRef);
    };

    // -------------------------------------------
    // SUBMIT FORM
    // -------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!carData.name) {
            alert("Car needs a name!");
            return;
        }

        const docId = carData.name.trim();

        try {
            // Upload main image
            let mainImageURL = "";
            if (mainImage) {
                mainImageURL = await uploadFile(
                    mainImage,
                    `Website_Img/Cars_Imgs_N_Background/${docId}.png`
                );
            }

            // -------------------------------
            // 📸 SORT GALLERY IMAGES FIRST
            // -------------------------------
            let galleryFiles = Array.from(galleryImages);
            galleryFiles.sort((a, b) =>
                a.name.localeCompare(b.name, undefined, { numeric: true })
            );

            let galleryURLs = [];

            for (let i = 0; i < galleryFiles.length; i++) {
                const file = galleryFiles[i];
                const url = await uploadFile(
                    file,
                    `Website_Img/Cars_Imgs/${docId}/${docId}-${i + 1}.png`
                );
                galleryURLs.push(url);
            }

            // SAVE TO FIRESTORE
            await setDoc(doc(db, "cars", docId), {
                name: carData.name,
                brand: carData.brand,
                year: Number(carData.year),
                kilometers: carData.kilometers,
                motor: carData.motor,
                seats: Number(carData.seats),
                doors: Number(carData.doors),
                car_type: carData.car_type,

                price: {
                    en: carData.price_en,
                    pt: carData.price_pt,
                },

                description: {
                    en: carData.description_en,
                    pt: carData.description_pt,
                },

                engine_type: {
                    en: carData.engine_en,
                    pt: carData.engine_pt,
                },

                fuel_type: {
                    en: carData.fuel_en,
                    pt: carData.fuel_pt,
                },

                transmission: {
                    en: carData.transmission_en,
                    pt: carData.transmission_pt,
                },

                image_no_background: mainImageURL,
                images: galleryURLs,
            });

            alert("Car added!");
            history.push("/admin/cars-list"); // redirect

        } catch (err) {
            console.error(err);
            alert("Error saving car");
        }
    };

    return (
        <div className="add-car-container">
            <h1>Adicionar Novo Carro</h1>

            <button type="button" className="ai-btn" onClick={autoFillWithAI}>
                Auto-fill with AI
            </button>

            <form className="add-car-form" onSubmit={handleSubmit}>
                <label>Nome</label>
                <input name="name" onChange={handleChange} required />

                <label>Marca</label>
                <input name="brand" value={carData.brand} onChange={handleChange} />

                <label>Ano</label>
                <input name="year" type="number" value={carData.year} onChange={handleChange} />

                <label>Quilómetros</label>
                <input name="kilometers" value={carData.kilometers} onChange={handleChange} />

                <label>Motor</label>
                <input name="motor" value={carData.motor} onChange={handleChange} />

                <label>Lugares</label>
                <input name="seats" type="number" value={carData.seats} onChange={handleChange} />

                <label>Portas</label>
                <input name="doors" type="number" value={carData.doors} onChange={handleChange} />

                <label>Tipo de Carro</label>
                <input name="car_type" value={carData.car_type} onChange={handleChange} />

                <h3>Descrição</h3>
                <input
                    name="description_pt"
                    value={carData.description_pt}
                    placeholder="Descrição PT"
                    onChange={handleChange}
                />
                <input
                    name="description_en"
                    value={carData.description_en}
                    placeholder="EN (auto traduzido)"
                    readOnly
                />

                <h3>Preço</h3>
                <input name="price_en" value={carData.price_en} onChange={handleChange} />
                <input name="price_pt" value={carData.price_pt} onChange={handleChange} />

                <h3>Engine Type</h3>
                <input name="engine_en" value={carData.engine_en} onChange={handleChange} />
                <input name="engine_pt" value={carData.engine_pt} onChange={handleChange} />

                <h3>Fuel Type</h3>
                <input name="fuel_en" value={carData.fuel_en} onChange={handleChange} />
                <input name="fuel_pt" value={carData.fuel_pt} onChange={handleChange} />

                <h3>Transmission</h3>
                <input name="transmission_en" value={carData.transmission_en} onChange={handleChange} />
                <input name="transmission_pt" value={carData.transmission_pt} onChange={handleChange} />

                <h3>Imagem Principal</h3>
                <input type="file" accept="image/png" onChange={(e) => setMainImage(e.target.files[0])} />

                <h3>Galeria de Imagens</h3>
                <input type="file" accept="image/png" multiple onChange={(e) => setGalleryImages(e.target.files)} />

                <button type="submit">Adicionar Carro</button>
            </form>
        </div>
    );
};

export default AdminAddCar;
