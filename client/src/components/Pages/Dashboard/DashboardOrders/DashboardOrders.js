import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchOrders, updateOrderStatus, deleteOrder } from '../../../../api/orders';
import Pagination, { usePagination } from '../Pagination/Pagination';
import FilterSelect from '../FilterSelect/FilterSelect';

const STATUS_LABELS = {
  novo: 'Novo',
  em_andamento: 'Em andamento',
  concluido: 'Concluído',
  cancelado: 'Cancelado'
};

function DashboardOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionId, setActionId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (statusFilter && order.status !== statusFilter) {
        return false;
      }
      if (dateFrom && new Date(order.createdAt) < new Date(`${dateFrom}T00:00:00`)) {
        return false;
      }
      if (dateTo && new Date(order.createdAt) > new Date(`${dateTo}T23:59:59`)) {
        return false;
      }
      return true;
    });
  }, [orders, statusFilter, dateFrom, dateTo]);

  const { page, setPage, totalPages, pageItems: pagedOrders } = usePagination(filteredOrders);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, dateFrom, dateTo, setPage]);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err);
      setError('Não foi possível carregar os pedidos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleStatusChange = async (id, status) => {
    setActionId(id);
    try {
      await updateOrderStatus(id, status);
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    } catch (err) {
      console.error('Erro ao atualizar status do pedido:', err);
      alert('Não foi possível atualizar o status do pedido.');
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este pedido?')) {
      return;
    }

    setActionId(id);
    try {
      await deleteOrder(id);
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      console.error('Erro ao excluir pedido:', err);
      alert('Não foi possível excluir o pedido.');
    } finally {
      setActionId(null);
    }
  };

  return (
    <>
      <header className="dashboard-header">
        <h1>Pedidos</h1>
        <p className="dashboard-subtitle">Pedidos feitos pelo carrinho da loja</p>
      </header>

      <div className="dashboard-content">
        <section className="content-section">
          <h2>Pedidos Recebidos</h2>

          {orders.length > 0 && (
            <div className="dashboard-filters">
              <FilterSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">Todos os status</option>
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </FilterSelect>
              <div className="filter-date-group">
                <span>De</span>
                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
              </div>
              <div className="filter-date-group">
                <span>Até</span>
                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
              </div>
              <button
                type="button"
                className="filter-clear-btn"
                disabled={!statusFilter && !dateFrom && !dateTo}
                onClick={() => {
                  setStatusFilter('');
                  setDateFrom('');
                  setDateTo('');
                }}
              >
                Limpar filtros
              </button>
            </div>
          )}

          {loading ? (
            <p className="empty-state">Carregando pedidos...</p>
          ) : error ? (
            <p className="empty-state">{error}</p>
          ) : orders.length === 0 ? (
            <p className="empty-state">Nenhum pedido recebido</p>
          ) : filteredOrders.length === 0 ? (
            <p className="empty-state">Nenhum pedido encontrado com esses filtros</p>
          ) : (
            <div className="product-table-wrapper">
              <table className="product-table">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Contato</th>
                    <th>Itens</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {pagedOrders.map((order) => (
                    <tr key={order.id} className={order.status === 'novo' ? 'unread-row' : ''}>
                      <td>{order.customerName}</td>
                      <td>
                        {order.customerPhone}
                        <br />
                        {order.customerEmail}
                      </td>
                      <td>
                        {order.items.map((item, idx) => (
                          <div key={idx}>
                            {item.quantity}x {item.name}
                          </div>
                        ))}
                      </td>
                      <td>
                        {Number(order.total).toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        })}
                      </td>
                      <td>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          disabled={actionId === order.id}
                        >
                          {Object.entries(STATUS_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="product-actions">
                        <button
                          className="delete-product-btn"
                          onClick={() => handleDelete(order.id)}
                          disabled={actionId === order.id}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination page={page} totalPages={totalPages} onChange={setPage} />
            </div>
          )}
        </section>
      </div>
    </>
  );
}

export default DashboardOrders;
