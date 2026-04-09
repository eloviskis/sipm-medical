import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'doctor', // ou 'clinic'
    cpf: '',
    cnpj: '',
    financialResponsible: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate(); // Hook para navegação

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    const db = getFirestore();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Salvar dados adicionais no Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: formData.email,
        role: formData.role,
        cpf: formData.role === 'doctor' ? formData.cpf : '',
        cnpj: formData.role === 'clinic' ? formData.cnpj : '',
        financialResponsible:
          formData.role === 'clinic' ? formData.financialResponsible : '',
      });

      console.log('Registro efetuado com sucesso!', user);
      setSuccessMessage('Registro efetuado com sucesso!');

      // Redirecionar o usuário para a página de login ou dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      setError(
        'Falha no registro. Verifique os dados e tente novamente. ' + error.message
      );
      console.error('Erro ao registrar:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Registro</h2>
        <form onSubmit={handleRegister}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="mb-4 p-2 w-full border border-gray-300 rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Senha"
            value={formData.password}
            onChange={handleChange}
            className="mb-4 p-2 w-full border border-gray-300 rounded"
            required
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="mb-4 p-2 w-full border border-gray-300 rounded"
          >
            <option value="doctor">Médico</option>
            <option value="clinic">Clínica</option>
          </select>
          {formData.role === 'doctor' && (
            <input
              type="text"
              name="cpf"
              placeholder="CPF"
              value={formData.cpf}
              onChange={handleChange}
              className="mb-4 p-2 w-full border border-gray-300 rounded"
              required
            />
          )}
          {formData.role === 'clinic' && (
            <>
              <input
                type="text"
                name="cnpj"
                placeholder="CNPJ"
                value={formData.cnpj}
                onChange={handleChange}
                className="mb-4 p-2 w-full border border-gray-300 rounded"
                required
              />
              <input
                type="text"
                name="financialResponsible"
                placeholder="Responsável Financeiro"
                value={formData.financialResponsible}
                onChange={handleChange}
                className="mb-4 p-2 w-full border border-gray-300 rounded"
                required
              />
            </>
          )}
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
          >
            Registrar
          </button>
        </form>
        {successMessage && (
          <p className="text-green-500 mt-4">{successMessage}</p>
        )}
        {error && <p className="error text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default Register;
