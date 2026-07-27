import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductForm from '../ProductForm/ProductForm';
import Pagination, { usePagination } from '../Pagination/Pagination';
import { fetchAllProducts, deleteProduct, updateProductVisibility } from '../../../../api/products';
import { fetchCategories, updateCategoryVisibility } from '../../../../api/categories';

function DashboardProducts() {
  const location = useLocation();
  const [showProductForm, setShowProductForm] = useState(Boolean(location.state?.openForm));
  const [editingProduct, setEditingProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [visibilityActionId, setVisibilityActionId] = useState(null);
  const { page, setPage, totalPages, pageItems: pagedProducts } = usePagination(products);

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState('');
  const [categoryActionId, setCategoryActionId] = useState(null);

  const loadProducts = useCallback(async () => {
    setProductsLoading(true);
    setProductsError('');
    try {
      const data = await fetchAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      setProductsError('Não foi possível carregar os produtos.');
    } finally {
      setProductsLoading(false);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    setCategoriesLoading(true);
    setCategoriesError('');
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      setCategoriesError('Não foi possível carregar as categorias.');
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [loadProducts, loadCategories]);

  const handleProductSuccess = () => {
    loadProducts();
    loadCategories();
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

  const handleToggleProductVisibility = async (product) => {
    setVisibilityActionId(product.id);
    try {
      const updated = await updateProductVisibility(product.id, !product.visible);
      setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, visible: updated.visible } : p)));
    } catch (error) {
      console.error('Erro ao atualizar visibilidade do produto:', error);
      alert('Não foi possível atualizar a visibilidade do produto.');
    } finally {
      setVisibilityActionId(null);
    }
  };

  const handleToggleCategoryVisibility = async (category) => {
    setCategoryActionId(category.id);
    try {
      const updated = await updateCategoryVisibility(category.id, !category.visible);
      setCategories((prev) => prev.map((c) => (c.id === category.id ? { ...c, visible: updated.visible } : c)));
    } catch (error) {
      console.error('Erro ao atualizar visibilidade da categoria:', error);
      alert('Não foi possível atualizar a visibilidade da categoria.');
    } finally {
      setCategoryActionId(null);
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
          <h2>Categorias</h2>
          <p className="section-hint">
            Ocultar uma categoria remove todos os produtos dela da página de produtos do site,
            sem apagar nenhum registro. Continua disponível pra cadastro de produtos aqui no painel.
          </p>
          {categoriesLoading ? (
            <p className="empty-state">Carregando categorias...</p>
          ) : categoriesError ? (
            <p className="empty-state">{categoriesError}</p>
          ) : categories.length === 0 ? (
            <p className="empty-state">Nenhuma categoria cadastrada</p>
          ) : (
            <div className="product-table-wrapper">
              <table className="product-table">
                <thead>
                  <tr>
                    <th>Categoria</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id} className={category.visible ? '' : 'hidden-row'}>
                      <td>{category.name}</td>
                      <td>{category.visible ? 'Visível no site' : 'Oculta do site'}</td>
                      <td className="product-actions">
                        <button
                          className={category.visible ? 'delete-product-btn' : 'edit-product-btn'}
                          onClick={() => handleToggleCategoryVisibility(category)}
                          disabled={categoryActionId === category.id}
                        >
                          {categoryActionId === category.id
                            ? 'Salvando...'
                            : category.visible ? 'Ocultar' : 'Mostrar'}
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
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {pagedProducts.map((product) => (
                    <tr key={product.id} className={product.visible ? '' : 'hidden-row'}>
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
                      <td>{product.visible ? 'Visível' : 'Oculto'}</td>
                      <td className="product-actions">
                        <button
                          className={product.visible ? 'delete-product-btn' : 'edit-product-btn'}
                          onClick={() => handleToggleProductVisibility(product)}
                          disabled={visibilityActionId === product.id}
                        >
                          {visibilityActionId === product.id
                            ? 'Salvando...'
                            : product.visible ? 'Ocultar' : 'Mostrar'}
                        </button>
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
