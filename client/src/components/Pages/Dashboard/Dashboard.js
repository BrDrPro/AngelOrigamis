import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../Dashboard/ProductForm/ProductForm';
import { fetchProducts, deleteProduct } from '../../../api/products';
import { apiFetch } from '../../../api/apiClient';
import './Dashboard.css';
import './DashboardResponsive.css';

function Dashboard() {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const loadProducts = useCallback(async () => {
    setProductsLoading(true);
    setProductsError('');
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      setProductsError('Não foi possível carregar os produtos.');
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

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

  const handleProductSuccess = () => {
    loadProducts();
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleCloseProductForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      alert('Não foi possível excluir o produto.');
    } finally {
      setDeletingId(null);
    }
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
              <p className="stat-number">{products.length}</p>
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
            <h2>Produtos Cadastrados</h2>
            {productsLoading ? (
              <p className="empty-state">Carregando produtos...</p>
            ) : productsError ? (
              <p className="empty-state">{productsError}</p>
            ) : products.length === 0 ? (
              <p className="empty-state">Nenhum produto cadastrado</p>
            ) : (
              <div className="product-table-wrapper">
                <table className="product-table">
                  <thead>
                    <tr>
                      <th>Imagem</th>
                      <th>Nome</th>
                      <th>Categoria</th>
                      <th>Preço</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td>
                          {product.imageUrls && product.imageUrls[0] ? (
                            <img
                              src={product.imageUrls[0]}
                              alt={product.name}
                              className="product-thumb"
                            />
                          ) : (
                            <div className="product-thumb product-thumb-empty" />
                          )}
                        </td>
                        <td>{product.name}</td>
                        <td>{product.category}</td>
                        <td>
                          {Number(product.price).toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          })}
                        </td>
                        <td className="product-actions">
                          <button
                            className="edit-product-btn"
                            onClick={() => handleEditProduct(product)}
                          >
                            Editar
                          </button>
                          <button
                            className="delete-product-btn"
                            onClick={() => handleDeleteProduct(product.id)}
                            disabled={deletingId === product.id}
                          >
                            {deletingId === product.id ? 'Excluindo...' : 'Excluir'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
          product={editingProduct}
          onClose={handleCloseProductForm}
          onSuccess={handleProductSuccess}
        />
      )}
    </div>
  );
}

export default Dashboard;