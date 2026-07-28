import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { apiFetch } from '../../../api/apiClient';
import './Dashboard.css';
import './DashboardResponsive.css';

function Dashboard() {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      const token = localStorage.getItem('adminToken');

      if (!token) {
        navigate('/admin/login');
        return;
      }

      try {
        const data = await apiFetch('/auth/verify', { auth: true });
        if (isMounted) {
          setAdminData(data);
        }
      } catch (error) {
        if (error.status) {
          localStorage.removeItem('adminToken');
        }
        console.error('Erro ao verificar autenticação:', error);
        navigate('/admin/login');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const navItemClass = ({ isActive }) => `nav-item${isActive ? ' active' : ''}`;

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <button
          type="button"
          className="sidebar-header sidebar-header-link"
          onClick={() => navigate('/')}
          title="Voltar para o site"
        >
          <img src="/assets/logo png.png" alt="Angel Origamis" className="sidebar-logo" />
          <h2>Painel Admin</h2>
        </button>

        <nav className="sidebar-nav">
          <NavLink to="/admin/dashboard" end className={navItemClass}>
            <i className="icon">🏠</i>
            <span>Início</span>
          </NavLink>
          <NavLink to="/admin/dashboard/produtos" className={navItemClass}>
            <i className="icon">📦</i>
            <span>Gerenciar</span>
          </NavLink>
          <NavLink to="/admin/dashboard/pedidos" className={navItemClass}>
            <i className="icon">📝</i>
            <span>Pedidos</span>
          </NavLink>
          <NavLink to="/admin/dashboard/mensagens" className={navItemClass}>
            <i className="icon">💬</i>
            <span>Mensagens</span>
          </NavLink>
          <NavLink to="/admin/dashboard/relatorios" className={navItemClass}>
            <i className="icon">📊</i>
            <span>Relatórios</span>
          </NavLink>
          <NavLink to="/admin/dashboard/configuracoes" className={navItemClass}>
            <i className="icon">⚙️</i>
            <span>Configurações</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="admin-info">
            <p className="admin-name">{adminData?.name || 'Administrador'}</p>
            <p className="admin-email">{adminData?.email}</p>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <i className="icon">🚪</i>
            <span>Sair</span>
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}

export default Dashboard;
