import React, { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
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
const auth = getAuth(app);

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    role: "",
    cpf: "",
    cnpj: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfileData(docSnap.data());
          } else {
            console.log("No such document!");
          }
        }
      } catch (error) {
        setError("Erro ao obter os dados do perfil.");
        console.error("Erro ao obter os dados do perfil:", error);
      }
    };
    fetchProfileData();
  }, []);

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        await updateDoc(docRef, profileData);
        console.log("Perfil atualizado com sucesso");
      }
    } catch (error) {
      setError("Erro ao atualizar o perfil.");
      console.error("Erro ao atualizar o perfil:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Perfil</h2>
        <input
          type="text"
          name="name"
          placeholder="Nome"
          value={profileData.name}
          onChange={handleChange}
          className="mb-4 p-2 w-full border border-gray-300 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={profileData.email}
          onChange={handleChange}
          className="mb-4 p-2 w-full border border-gray-300 rounded"
        />
        <select
          name="role"
          value={profileData.role}
          onChange={handleChange}
          className="mb-4 p-2 w-full border border-gray-300 rounded"
        >
          <option value="doctor">Médico</option>
          <option value="clinic">Clínica</option>
        </select>
        {profileData.role === "doctor" && (
          <input
            type="text"
            name="cpf"
            placeholder="CPF"
            value={profileData.cpf}
            onChange={handleChange}
            className="mb-4 p-2 w-full border border-gray-300 rounded"
          />
        )}
        {profileData.role === "clinic" && (
          <input
            type="text"
            name="cnpj"
            placeholder="CNPJ"
            value={profileData.cnpj}
            onChange={handleChange}
            className="mb-4 p-2 w-full border border-gray-300 rounded"
          />
        )}
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
        >
          Salvar
        </button>
        {error && <p className="error text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default Profile;
