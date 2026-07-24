import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductForm from '../ProductForm/ProductForm';
import Pagination, { usePagination } from '../Pagination/Pagination';
import { fetchProducts, deleteProduct } from '../../../../api/products';

function DashboardProducts() {
  const location = useLocation();
  const [showProductForm, setShowProductForm] = useState(Boolean(location.state?.openForm));
  const [editingProduct, setEditingProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const { page, setPage, totalPages, pageItems: pagedProducts } = usePagination(products);

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

  return (
    <>
      <header className="dashboard-header">
        <h1>Produtos</h1>
        <p className="dashboard-subtitle">Gerencie o catálogo da loja</p>
      </header>

      <div className="dashboard-content">
        <section className="content-section">
          <h2>Ações</h2>
          <div className="quick-actions">
            <button className="action-btn" onClick={() => setShowProductForm(true)}>
              <i className="icon">➕</i>
              <span>Adicionar Produto</span>
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
                  {pagedProducts.map((product) => (
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
              <Pagination page={page} totalPages={totalPages} onChange={setPage} />
            </div>
          )}
        </section>
      </div>

      {showProductForm && (
        <ProductForm
          product={editingProduct}
          onClose={handleCloseProductForm}
          onSuccess={handleProductSuccess}
        />
      )}
    </>
  );
}

export default DashboardProducts;
