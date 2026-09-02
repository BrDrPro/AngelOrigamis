import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductForm from '../ProductForm/ProductForm';
import Pagination, { usePagination } from '../Pagination/Pagination';
import FilterSelect from '../FilterSelect/FilterSelect';
import SiteContentSection from './SiteContentSection';
import { fetchAllProducts, deleteProduct, updateProductVisibility, updateProductFeatured } from '../../../../api/products';
import { fetchCategories, updateCategoryVisibility, updateCategoryDescription } from '../../../../api/categories';

const SECTIONS = [
  { id: 'produtos', label: 'Produtos Cadastrados', icon: '📦' },
  { id: 'categorias', label: 'Categorias', icon: '🏷️' },
  { id: 'conteudo', label: 'Conteúdo do Site', icon: '📝' },
];

function DashboardProducts() {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState(
    location.state?.openForm ? 'produto-form' : location.state?.section || 'produtos'
  );
  const [editingProduct, setEditingProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [visibilityActionId, setVisibilityActionId] = useState(null);
  const [featuredActionId, setFeaturedActionId] = useState(null);
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('');
  const [productStatusFilter, setProductStatusFilter] = useState('');
  const [productFeaturedFilter, setProductFeaturedFilter] = useState('');
  const [productPriceMin, setProductPriceMin] = useState('');
  const [productPriceMax, setProductPriceMax] = useState('');

  const filteredProducts = useMemo(() => {
    const minPrice = productPriceMin.trim() ? Number(productPriceMin) : null;
    const maxPrice = productPriceMax.trim() ? Number(productPriceMax) : null;

    return products.filter((product) => {
      if (productSearch.trim() && !product.name.toLowerCase().includes(productSearch.trim().toLowerCase())) {
        return false;
      }
      if (productCategoryFilter && product.category !== productCategoryFilter) {
        return false;
      }
      if (productStatusFilter === 'visible' && !product.visible) {
        return false;
      }
      if (productStatusFilter === 'hidden' && product.visible) {
        return false;
      }
      if (productFeaturedFilter === 'featured' && !product.featured) {
        return false;
      }
      if (productFeaturedFilter === 'not-featured' && product.featured) {
        return false;
      }
      if (minPrice !== null && !Number.isNaN(minPrice) && Number(product.price) < minPrice) {
        return false;
      }
      if (maxPrice !== null && !Number.isNaN(maxPrice) && Number(product.price) > maxPrice) {
        return false;
      }
      return true;
    });
  }, [products, productSearch, productCategoryFilter, productStatusFilter, productFeaturedFilter, productPriceMin, productPriceMax]);

  const { page, setPage, totalPages, pageItems: pagedProducts } = usePagination(filteredProducts);

  useEffect(() => {
    setPage(1);
  }, [productSearch, productCategoryFilter, productStatusFilter, productFeaturedFilter, productPriceMin, productPriceMax, setPage]);

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState('');
  const [categoryActionId, setCategoryActionId] = useState(null);
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);
  const [descriptionDraft, setDescriptionDraft] = useState('');
  const [descriptionSavingId, setDescriptionSavingId] = useState(null);
  const [categorySearch, setCategorySearch] = useState('');
  const [categoryStatusFilter, setCategoryStatusFilter] = useState('');

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      if (categorySearch.trim() && !category.name.toLowerCase().includes(categorySearch.trim().toLowerCase())) {
        return false;
      }
      if (categoryStatusFilter === 'visible' && !category.visible) {
        return false;
      }
      if (categoryStatusFilter === 'hidden' && category.visible) {
        return false;
      }
      return true;
    });
  }, [categories, categorySearch, categoryStatusFilter]);

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

  const handleAddProduct = () => {
    setEditingProduct(null);
    setActiveSection('produto-form');
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setActiveSection('produto-form');
  };

  const handleCloseProductForm = () => {
    setActiveSection('produtos');
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

  const handleToggleProductFeatured = async (product) => {
    setFeaturedActionId(product.id);
    try {
      const updated = await updateProductFeatured(product.id, !product.featured);
      setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, featured: updated.featured } : p)));
    } catch (error) {
      console.error('Erro ao atualizar destaque do produto:', error);
      alert('Não foi possível atualizar o destaque do produto.');
    } finally {
      setFeaturedActionId(null);
    }
  };

  const handleToggleDescriptionEditor = (category) => {
    if (expandedCategoryId === category.id) {
      setExpandedCategoryId(null);
      return;
    }
    setExpandedCategoryId(category.id);
    setDescriptionDraft(category.description || '');
  };

  const handleSaveDescription = async (category) => {
    setDescriptionSavingId(category.id);
    try {
      const updated = await updateCategoryDescription(category.id, descriptionDraft.trim());
      setCategories((prev) =>
        prev.map((c) => (c.id === category.id ? { ...c, description: updated.description } : c))
      );
      setExpandedCategoryId(null);
    } catch (error) {
      console.error('Erro ao atualizar descrição da categoria:', error);
      alert('Não foi possível atualizar a descrição da categoria.');
    } finally {
      setDescriptionSavingId(null);
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
        <h1>Gerenciar</h1>
        <p className="dashboard-subtitle">Produtos, categorias e conteúdo do site</p>
      </header>

      <div className="dashboard-content">
        <section className="content-section">
          <h2>Menu</h2>
          <div className="quick-actions">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                className={`action-btn${activeSection === section.id ? ' action-btn-active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <i className="icon">{section.icon}</i>
                <span>{section.label}</span>
              </button>
            ))}
            <button
              className={`action-btn${activeSection === 'produto-form' && !editingProduct ? ' action-btn-active' : ''}`}
              onClick={handleAddProduct}
            >
              <i className="icon">➕</i>
              <span>Adicionar Produto</span>
            </button>
          </div>
        </section>

        {activeSection === 'produto-form' && (
          <ProductForm
            product={editingProduct}
            onClose={handleCloseProductForm}
            onSuccess={handleProductSuccess}
          />
        )}

        {activeSection === 'conteudo' && <SiteContentSection />}

        {activeSection === 'categorias' && (
        <section className="content-section">
          <h2>Categorias</h2>
          <p className="section-hint">
            Ocultar uma categoria remove todos os produtos dela da página de produtos do site,
            sem apagar nenhum registro. Continua disponível pra cadastro de produtos aqui no painel.
          </p>

          {categories.length > 0 && (
            <div className="dashboard-filters">
              <input
                type="text"
                placeholder="Buscar categoria por nome..."
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
              />
              <FilterSelect value={categoryStatusFilter} onChange={(e) => setCategoryStatusFilter(e.target.value)}>
                <option value="">Todos os status</option>
                <option value="visible">Visíveis</option>
                <option value="hidden">Ocultas</option>
              </FilterSelect>
              <button
                type="button"
                className="filter-clear-btn"
                disabled={!categorySearch && !categoryStatusFilter}
                onClick={() => {
                  setCategorySearch('');
                  setCategoryStatusFilter('');
                }}
              >
                Limpar filtros
              </button>
            </div>
          )}

          {categoriesLoading ? (
            <p className="empty-state">Carregando categorias...</p>
          ) : categoriesError ? (
            <p className="empty-state">{categoriesError}</p>
          ) : categories.length === 0 ? (
            <p className="empty-state">Nenhuma categoria cadastrada</p>
          ) : filteredCategories.length === 0 ? (
            <p className="empty-state">Nenhuma categoria encontrada com esses filtros</p>
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
                  {filteredCategories.map((category) => (
                    <React.Fragment key={category.id}>
                      <tr className={category.visible ? '' : 'hidden-row'}>
                        <td>{category.name}</td>
                        <td>{category.visible ? 'Visível no site' : 'Oculta do site'}</td>
                        <td className="product-actions">
                          <button
                            className="edit-product-btn"
                            onClick={() => handleToggleDescriptionEditor(category)}
                          >
                            {expandedCategoryId === category.id ? 'Fechar' : 'Editar descrição'}
                          </button>
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
                      {expandedCategoryId === category.id && (
                        <tr className={category.visible ? '' : 'hidden-row'}>
                          <td colSpan={3}>
                            <div className="settings-form settings-form-wide">
                              <div className="form-group">
                                <label htmlFor={`desc-${category.id}`}>
                                  Descrição pública (aparece na página de Produtos quando essa categoria é expandida)
                                </label>
                                <textarea
                                  id={`desc-${category.id}`}
                                  rows={4}
                                  value={descriptionDraft}
                                  onChange={(e) => setDescriptionDraft(e.target.value)}
                                  placeholder="Descreva essa categoria para os clientes..."
                                />
                              </div>
                              <div className="quick-actions">
                                <button
                                  className="action-btn"
                                  onClick={() => handleSaveDescription(category)}
                                  disabled={descriptionSavingId === category.id}
                                >
                                  {descriptionSavingId === category.id ? 'Salvando...' : 'Salvar descrição'}
                                </button>
                                <button
                                  type="button"
                                  className="cancel-btn"
                                  onClick={() => setExpandedCategoryId(null)}
                                >
                                  Cancelar
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        )}

        {activeSection === 'produtos' && (
        <section className="content-section">
          <h2>Produtos Cadastrados</h2>

          {products.length > 0 && (
            <div className="dashboard-filters">
              <input
                type="text"
                placeholder="Buscar produto por nome..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
              />
              <FilterSelect value={productCategoryFilter} onChange={(e) => setProductCategoryFilter(e.target.value)}>
                <option value="">Categorias</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>{category.name}</option>
                ))}
              </FilterSelect>
              <FilterSelect value={productStatusFilter} onChange={(e) => setProductStatusFilter(e.target.value)}>
                <option value="">Status</option>
                <option value="visible">Visíveis</option>
                <option value="hidden">Ocultos</option>
              </FilterSelect>
              <FilterSelect value={productFeaturedFilter} onChange={(e) => setProductFeaturedFilter(e.target.value)}>
                <option value="">Destaque</option>
                <option value="featured">Em destaque</option>
                <option value="not-featured">Sem destaque</option>
              </FilterSelect>
              <div className="filter-price-group">
                <span>R$</span>
                <input
                  type="number"
                  min="0"
                  placeholder="mín."
                  value={productPriceMin}
                  onChange={(e) => setProductPriceMin(e.target.value)}
                />
                <span>-</span>
                <input
                  type="number"
                  min="0"
                  placeholder="máx."
                  value={productPriceMax}
                  onChange={(e) => setProductPriceMax(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="filter-clear-btn"
                disabled={!productSearch && !productCategoryFilter && !productStatusFilter && !productFeaturedFilter && !productPriceMin && !productPriceMax}
                onClick={() => {
                  setProductSearch('');
                  setProductCategoryFilter('');
                  setProductStatusFilter('');
                  setProductFeaturedFilter('');
                  setProductPriceMin('');
                  setProductPriceMax('');
                }}
              >
                Limpar filtros
              </button>
            </div>
          )}

          {productsLoading ? (
            <p className="empty-state">Carregando produtos...</p>
          ) : productsError ? (
            <p className="empty-state">{productsError}</p>
          ) : products.length === 0 ? (
            <p className="empty-state">Nenhum produto cadastrado</p>
          ) : filteredProducts.length === 0 ? (
            <p className="empty-state">Nenhum produto encontrado com esses filtros</p>
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
                    <th>Destaque</th>
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
                      <td>{product.featured ? '⭐ Em destaque' : '—'}</td>
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
                          className={product.featured ? 'delete-product-btn' : 'edit-product-btn'}
                          onClick={() => handleToggleProductFeatured(product)}
                          disabled={featuredActionId === product.id}
                        >
                          {featuredActionId === product.id
                            ? 'Salvando...'
                            : product.featured ? 'Remover destaque' : 'Destacar'}
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
        )}
      </div>
    </>
  );
}

export default DashboardProducts;
