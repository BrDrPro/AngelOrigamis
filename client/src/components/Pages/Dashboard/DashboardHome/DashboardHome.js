import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '../../../../api/products';
import { fetchContactRequests } from '../../../../api/contactRequests';
import { fetchOrders } from '../../../../api/orders';

function DashboardHome() {
  const [productsCount, setProductsCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts()
      .then((data) => setProductsCount(data.length))
      .catch((error) => console.error('Erro ao buscar produtos:', error));

    fetchContactRequests()
      .then((data) => setUnreadCount(data.filter((r) => !r.read).length))
      .catch((error) => console.error('Erro ao buscar mensagens:', error));

    fetchOrders()
      .then((data) => setPendingOrdersCount(data.filter((o) => o.status === 'novo').length))
      .catch((error) => console.error('Erro ao buscar pedidos:', error));
  }, []);

  return (
    <>
      <header className="dashboard-header">
        <h1>Bem-vindo ao Painel Administrativo</h1>
        <p className="dashboard-subtitle">Gerencie sua loja de origamis</p>
      </header>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#6D9E8B' }}>📦</div>
          <div className="stat-content">
            <h3>Total de Produtos</h3>
            <p className="stat-number">{productsCount}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#D19AAE' }}>📝</div>
          <div className="stat-content">
            <h3>Pedidos Pendentes</h3>
            <p className="stat-number">{pendingOrdersCount}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#6D9E8B' }}>💬</div>
          <div className="stat-content">
            <h3>Novas Mensagens</h3>
            <p className="stat-number">{unreadCount}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#D19AAE' }}>👥</div>
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
            <button
              className="action-btn"
              onClick={() => navigate('/admin/dashboard/produtos', { state: { openForm: true } })}
            >
              <i className="icon">➕</i>
              <span>Adicionar Produto</span>
            </button>
            <button className="action-btn" onClick={() => navigate('/admin/dashboard/pedidos')}>
              <i className="icon">📋</i>
              <span>Ver Pedidos</span>
            </button>
            <button className="action-btn" onClick={() => navigate('/admin/dashboard/mensagens')}>
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
    </>
  );
}

export default DashboardHome;
