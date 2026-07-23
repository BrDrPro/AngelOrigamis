import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../../api/apiClient';
import './AdmLogin.css';
import './AdmLoginResponsive.css';

function AdmLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isMountedRef = useRef(true);
  const abortRef = useRef(null);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isMountedRef.current) return;
    setError('');
    setLoading(true);

    try {
      if (abortRef.current) {
        abortRef.current.abort();
      }
      const controller = new AbortController();
      abortRef.current = controller;

      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: { email, password },
        signal: controller.signal,
      });

      // Salva o token no localStorage
      localStorage.setItem('adminToken', data.token);

      // Limpa os campos de senha
      if (isMountedRef.current) {
        setEmail('');
        setPassword('');
      }

      // Redireciona para o painel
      navigate('/admin/dashboard');
    } catch (err) {
      if (err && err.name === 'AbortError') return;
      if (isMountedRef.current) {
        const message = err.status
          ? err.data?.message || 'Credenciais inválidas'
          : 'Erro ao conectar com o servidor';
        setError(message);
      }
      console.error('Erro no login:', err);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
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

        <button
          type="button"
          className="back-to-site-button"
          onClick={() => navigate('/')}
        >
          ← Voltar para o site
        </button>
      </div>
    </div>
  );
}

export default AdmLogin;