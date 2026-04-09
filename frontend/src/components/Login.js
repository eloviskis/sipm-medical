import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; // Correção: Importando 'useNavigate' para redirecionamento pós-login
import './Login.css'; // Sugestão: Importar CSS específico para estilos relacionados ao login

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Correção: Inicializando 'useNavigate' para redirecionamento

  const handleLogin = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Sucesso na autenticação
      console.log('Login efetuado com sucesso!');

      navigate('/dashboard'); // Correção: Redirecionando para o dashboard após o login bem-sucedido

    } catch (error) {
      setError('Falha na autenticação. Verifique suas credenciais.');
      console.error('Erro de autenticação:', error); // Sugestão: Log detalhado do erro para depuração
    }
  };

  return (
    <div className="login-container">
      <h2>Entrar</h2>
      <form onSubmit={handleLogin}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Senha:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Login;
