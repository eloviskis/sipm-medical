import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PatientRecord = () => {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get('/api/patient-records');
        setRecords(response.data);
      } catch (error) {
        setError('Erro ao obter registros de pacientes.');
        console.error('Erro ao obter registros de pacientes:', error);
      }
    };

    fetchRecords();
  }, []);

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Registros de Pacientes</h2>
      {error && <p className="error text-red-500">{error}</p>}
      <ul>
        {records.map((record) => (
          <li key={record.id} className="mb-2">
            {record.name}: {record.details}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatientRecord;
