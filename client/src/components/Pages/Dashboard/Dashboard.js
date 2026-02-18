import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../Dashboard/ProductForm/ProductForm';
import './Dashboard.css';
import './DashboardResponsive.css';

function Dashboard() {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
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
        const apiUrl = process.env.NODE_ENV === 'production'
          ? 'https://angelorigamis.com.br/api/auth/verify'
          : 'http://localhost:3001/api/auth/verify';

        const response = await fetch(apiUrl, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (isMounted) {
            setAdminData(data);
          }
        } else {
          localStorage.removeItem('adminToken');
          navigate('/admin/login');
        }
      } catch (error) {
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

  const handleProductSuccess = () => {
    // Aqui você pode atualizar a lista de produtos ou mostrar uma mensagem de sucesso
    console.log('Produto criado com sucesso!');
  };

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
        <div className="sidebar-header">
          <img src="/assets/logo png.png" alt="Angel Origamis" className="sidebar-logo" />
          <h2>Painel Admin</h2>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item active">
            <i className="icon">📊</i>
            <span>Dashboard</span>
          </button>
          <button className="nav-item">
            <i className="icon">📦</i>
            <span>Produtos</span>
          </button>
          <button className="nav-item">
            <i className="icon">📝</i>
            <span>Pedidos</span>
          </button>
          <button className="nav-item">
            <i className="icon">💬</i>
            <span>Mensagens</span>
          </button>
          <button className="nav-item">
            <i className="icon">⚙️</i>
            <span>Configurações</span>
          </button>
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
        <header className="dashboard-header">
          <h1>Bem-vindo ao Painel Administrativo</h1>
          <p className="dashboard-subtitle">Gerencie sua loja de origamis</p>
        </header>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon" style={{background: '#6D9E8B'}}>📦</div>
            <div className="stat-content">
              <h3>Total de Produtos</h3>
              <p className="stat-number">0</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{background: '#D19AAE'}}>📝</div>
            <div className="stat-content">
              <h3>Pedidos Pendentes</h3>
              <p className="stat-number">0</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{background: '#6D9E8B'}}>💬</div>
            <div className="stat-content">
              <h3>Novas Mensagens</h3>
              <p className="stat-number">0</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{background: '#D19AAE'}}>👥</div>
            <div className="stat-content">
              <h3>Visitantes Hoje</h3>
              <p className="stat-number">0</p>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          <section className="content-section">
            <h2>Ações Rápidas</h2>
            <div className="quick-actions">
              <button className="action-btn" onClick={() => setShowProductForm(true)}>
                <i className="icon">➕</i>
                <span>Adicionar Produto</span>
              </button>
              <button className="action-btn">
                <i className="icon">📋</i>
                <span>Ver Pedidos</span>
              </button>
              <button className="action-btn">
                <i className="icon">✉️</i>
                <span>Ver Mensagens</span>
              </button>
              <button className="action-btn">
                <i className="icon">📊</i>
                <span>Relatórios</span>
              </button>
            </div>
          </section>

          <section className="content-section">
            <h2>Atividades Recentes</h2>
            <div className="activity-list">
              <p className="empty-state">Nenhuma atividade recente</p>
            </div>
          </section>
        </div>
      </main>

      {showProductForm && (
        <ProductForm
          onClose={() => setShowProductForm(false)}
          onSuccess={handleProductSuccess}
        />
      )}
    </div>
  );
}

export default Dashboard;