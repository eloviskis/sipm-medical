import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const Carousel = () => {
  const [current, setCurrent] = useState(0);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "carouselImages"));
        const imagesData = querySnapshot.docs.map((doc) => doc.data().url);
        setImages(imagesData);
      } catch (error) {
        console.error("Erro ao buscar imagens do carrossel:", error);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prevCurrent) =>
        prevCurrent === images.length - 1 ? 0 : prevCurrent + 1
      );
    }, 3000); // Mudar imagem a cada 3 segundos

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="carousel">
      {images.map((image, index) => (
        <div
          key={index}
          className={`carousel-item ${index === current ? "block" : "hidden"}`}
        >
          <img src={image} alt={`Slide ${index}`} className="w-full h-auto" />
        </div>
      ))}
    </div>
  );
};

export default Carousel;
