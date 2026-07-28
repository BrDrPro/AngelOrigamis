import React, { useEffect, useMemo, useState } from 'react';
import { fetchOrders } from '../../../../api/orders';

const STATUS_LABELS = {
  novo: 'Novo',
  em_andamento: 'Em andamento',
  concluido: 'Concluído',
  cancelado: 'Cancelado'
};

function formatCurrency(value) {
  return Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function DashboardReports() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders()
      .then(setOrders)
      .catch((err) => {
        console.error('Erro ao buscar pedidos:', err);
        setError('Não foi possível carregar os dados dos pedidos.');
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const validOrders = orders.filter((o) => o.status !== 'cancelado');
    const totalRevenue = validOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);

    const statusCounts = orders.reduce((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {});

    const productTotals = {};
    validOrders.forEach((order) => {
      (order.items || []).forEach((item) => {
        productTotals[item.name] = (productTotals[item.name] || 0) + Number(item.quantity || 0);
      });
    });
    const topProducts = Object.entries(productTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      totalOrders: orders.length,
      totalRevenue,
      averageTicket: validOrders.length > 0 ? totalRevenue / validOrders.length : 0,
      statusCounts,
      topProducts,
    };
  }, [orders]);

  return (
    <>
      <header className="dashboard-header">
        <h1>Relatórios</h1>
        <p className="dashboard-subtitle">Visão geral de vendas e pedidos</p>
      </header>

      {loading ? (
        <p className="empty-state">Carregando relatórios...</p>
      ) : error ? (
        <p className="empty-state">{error}</p>
      ) : orders.length === 0 ? (
        <p className="empty-state">Nenhum pedido registrado ainda</p>
      ) : (
        <div className="dashboard-content">
          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#6D9E8B' }}>📝</div>
              <div className="stat-content">
                <h3>Total de Pedidos</h3>
                <p className="stat-number">{stats.totalOrders}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#D19AAE' }}>💰</div>
              <div className="stat-content">
                <h3>Receita Total</h3>
                <p className="stat-number">{formatCurrency(stats.totalRevenue)}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#6D9E8B' }}>🎯</div>
              <div className="stat-content">
                <h3>Ticket Médio</h3>
                <p className="stat-number">{formatCurrency(stats.averageTicket)}</p>
              </div>
            </div>
          </div>

          <section className="content-section">
            <h2>Pedidos por Status</h2>
            <div className="product-table-wrapper">
              <table className="product-table">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Quantidade</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <tr key={value}>
                      <td>{label}</td>
                      <td>{stats.statusCounts[value] || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="content-section">
            <h2>Produtos Mais Vendidos</h2>
            {stats.topProducts.length === 0 ? (
              <p className="empty-state">Nenhum item vendido ainda</p>
            ) : (
              <div className="product-table-wrapper">
                <table className="product-table">
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th>Quantidade vendida</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.topProducts.map(([name, quantity]) => (
                      <tr key={name}>
                        <td>{name}</td>
                        <td>{quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}
    </>
  );
}

export default DashboardReports;
