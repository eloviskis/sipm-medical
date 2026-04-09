import React, { useState } from "react";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

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
const auth = getAuth(app);

const Customization = () => {
  const [themeColor, setThemeColor] = useState("#ffffff");
  const [language, setLanguage] = useState("pt");
  const [error, setError] = useState("");

  const handleSaveCustomization = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const customizationRef = doc(db, "customizations", user.uid);
        await setDoc(
          customizationRef,
          {
            themeColor,
            language,
          },
          { merge: true }
        );
        console.log("Customização salva com sucesso!");
      } else {
        setError("Usuário não autenticado.");
      }
    } catch (error) {
      setError("Erro ao salvar a customização. Tente novamente.");
      console.error("Erro ao salvar a customização:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Customização</h2>
        <div className="mb-4">
          <label htmlFor="themeColor" className="block mb-2">
            Cor do Tema:
          </label>
          <input
            type="color"
            id="themeColor"
            value={themeColor}
            onChange={(e) => setThemeColor(e.target.value)}
            className="p-2 w-full border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="language" className="block mb-2">
            Idioma:
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="p-2 w-full border border-gray-300 rounded"
          >
            <option value="pt">Português</option>
            <option value="en">Inglês</option>
            {/* Adicione mais opções de idioma conforme necessário */}
          </select>
        </div>
        <button
          onClick={handleSaveCustomization}
          className="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-700 transition duration-200"
        >
          Salvar
        </button>
        {error && <p className="error text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default Customization;
