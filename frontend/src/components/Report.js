import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Report = () => {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('/api/reports');
        setReports(response.data);
      } catch (error) {
        setError('Erro ao obter relatórios.');
        console.error('Erro ao obter relatórios:', error);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-green-100 p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-green-700">Relatórios</h2>
        {error && <p className="error text-red-500 mb-4">{error}</p>}
        <ul className="mb-4">
          {reports.map((report) => (
            <li key={report.id} className="mb-2 bg-white p-2 rounded shadow">{report.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Report;
