import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
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

const AccountsPayable = () => {
  const [accounts, setAccounts] = useState([]);
  const [newAccount, setNewAccount] = useState({
    name: "",
    amount: "",
    dueDate: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "accounts-payable"));
        const accountsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAccounts(accountsData);
      } catch (error) {
        setError("Erro ao buscar contas a pagar.");
        console.error("Erro ao buscar contas a pagar:", error);
      }
    };
    fetchAccounts();
  }, []);

  const handleAddAccount = async () => {
    try {
      const docRef = await addDoc(
        collection(db, "accounts-payable"),
        newAccount
      );
      setAccounts([...accounts, { id: docRef.id, ...newAccount }]);
      setNewAccount({ name: "", amount: "", dueDate: "" });
    } catch (error) {
      setError("Erro ao adicionar nova conta.");
      console.error("Erro ao adicionar nova conta:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Contas a Pagar</h2>
        {error && <p className="error text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Nome da Conta"
            value={newAccount.name}
            onChange={(e) =>
              setNewAccount({ ...newAccount, name: e.target.value })
            }
            className="p-2 w-full border border-gray-300 rounded"
          />
          <input
            type="number"
            placeholder="Valor"
            value={newAccount.amount}
            onChange={(e) =>
              setNewAccount({ ...newAccount, amount: e.target.value })
            }
            className="p-2 w-full border border-gray-300 rounded mt-2"
          />
          <input
            type="date"
            placeholder="Data de Vencimento"
            value={newAccount.dueDate}
            onChange={(e) =>
              setNewAccount({ ...newAccount, dueDate: e.target.value })
            }
            className="p-2 w-full border border-gray-300 rounded mt-2"
          />
          <button
            onClick={handleAddAccount}
            className="bg-red-500 text-white p-2 w-full rounded mt-2 hover:bg-red-700 transition duration-200"
          >
            Adicionar Conta
          </button>
        </div>
        <ul>
          {accounts.map((account, index) => (
            <li key={index} className="mb-4 p-4 bg-gray-200 rounded">
              <p>Nome: {account.name}</p>
              <p>Valor: {account.amount}</p>
              <p>Data de Vencimento: {account.dueDate}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AccountsPayable;
