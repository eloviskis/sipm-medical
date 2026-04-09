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

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    services: 0,
    appointments: 0,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const servicesSnapshot = await getDocs(collection(db, "services"));
        const appointmentsSnapshot = await getDocs(
          collection(db, "appointments")
        );

        setStats({
          users: usersSnapshot.size,
          services: servicesSnapshot.size,
          appointments: appointmentsSnapshot.size,
        });
      } catch (error) {
        setError("Erro ao carregar as estatísticas.");
        console.error("Erro ao carregar as estatísticas:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Painel de Controle
        </h2>
        {error && <p className="error text-red-500 mb-4">{error}</p>}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-gray-200 rounded">
            <h3 className="text-xl font-bold">Usuários</h3>
            <p>{stats.users}</p>
          </div>
          <div className="p-4 bg-gray-200 rounded">
            <h3 className="text-xl font-bold">Serviços</h3>
            <p>{stats.services}</p>
          </div>
          <div className="p-4 bg-gray-200 rounded">
            <h3 className="text-xl font-bold">Agendamentos</h3>
            <p>{stats.appointments}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
