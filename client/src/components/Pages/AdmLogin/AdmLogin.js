import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdmLogin.css';
import './AdmLoginResponsive.css';

function AdmLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const apiUrl = process.env.NODE_ENV === 'production' 
        ? 'https://angelorigamis.com.br/api/auth/login'
        : 'http://localhost:3001/api/auth/login';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Salva o token no localStorage
        localStorage.setItem('adminToken', data.token);
        
        // Limpa os campos de senha
        setEmail('');
        setPassword('');
        
        // Redireciona para o painel
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Credenciais inválidas');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
      console.error('Erro no login:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <img src="/assets/logo png.png" alt="Angel Origamis" className="login-logo" />
          <h2>Painel Administrativo</h2>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="Digite seu e-mail"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="Digite sua senha"
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdmLogin;