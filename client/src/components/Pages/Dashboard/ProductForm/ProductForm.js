import React, { useEffect, useMemo, useState } from 'react';
import './ProductForm.css';
import { createProduct, updateProduct } from '../../../../api/products';
import { fetchCategories } from '../../../../api/categories';
import SearchableSelect from './SearchableSelect';

function ProductForm({ product, onClose, onSuccess }) {
  const isEditMode = Boolean(product);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    subcategory: '',
    measure: '',
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch((err) => console.error('Erro ao buscar categorias:', err));
  }, []);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price != null ? String(product.price) : '',
        category: product.category || '',
        subcategory: product.subcategory || '',
        measure: product.measure || '',
      });
      setExistingImages(product.imageUrls || []);
    }
  }, [product]);

  const categoryNames = useMemo(() => categories.map((c) => c.name), [categories]);

  const subcategoryNames = useMemo(() => {
    const match = categories.find(
      (c) => c.name.toLowerCase() === formData.category.trim().toLowerCase()
    );
    return match ? match.subcategories.map((s) => s.name) : [];
  }, [categories, formData.category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategorySelect = (value) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
      // Uma categoria diferente pode não ter a mesma subcategoria - evita
      // salvar uma combinação que não faz sentido.
      subcategory: value === prev.category ? prev.subcategory : ''
    }));
  };

  const handleSubcategorySelect = (value) => {
    setFormData((prev) => ({ ...prev, subcategory: value }));
  };

  const handleFilesChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...selectedFiles]);
    e.target.value = '';
  };

  const removeNewImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (url) => {
    if (!window.confirm('Remover esta imagem? Ela será apagada definitivamente ao salvar o produto.')) {
      return;
    }
    setExistingImages((prev) => prev.filter((u) => u !== url));
  };

  useEffect(() => {
    const previews = images.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);

    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const totalImages = existingImages.length + images.length;
      if (totalImages === 0) {
        setError('Selecione pelo menos uma imagem.');
        setLoading(false);
        return;
      }

      if (!formData.description.trim()) {
        setError('A descrição é obrigatória.');
        setLoading(false);
        return;
      }

      if (!formData.category.trim()) {
        setError('A categoria é obrigatória.');
        setLoading(false);
        return;
      }

      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('description', formData.description);
      payload.append('price', String(parseFloat(formData.price)));
      payload.append('category', formData.category.trim());
      payload.append('subcategory', formData.subcategory.trim());
      payload.append('measure', formData.measure);
      images.forEach((file) => payload.append('images', file));

      if (isEditMode) {
        payload.append('keepImageUrls', JSON.stringify(existingImages));
        await updateProduct(product.id, payload);
      } else {
        await createProduct(payload);
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.data?.message || err.message || 'Erro ao salvar produto');
      console.error('Erro ao salvar produto:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="content-section">
      <h2>{isEditMode ? 'Editar Produto' : 'Adicionar Novo Produto'}</h2>

      <form onSubmit={handleSubmit} className="product-form">
        {error && <div className="error-message">{error}</div>}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Nome do Produto *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Ex: Buquê de Rosas"
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Categoria *</label>
              <SearchableSelect
                id="category"
                value={formData.category}
                onChange={handleCategorySelect}
                options={categoryNames}
                placeholder="Digite ou selecione uma categoria"
                entityLabel="Categoria"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="subcategory">Subcategoria</label>
              <SearchableSelect
                id="subcategory"
                value={formData.subcategory}
                onChange={handleSubcategorySelect}
                options={subcategoryNames}
                placeholder="Opcional - digite ou selecione"
                entityLabel="Subcategoria"
                disabled={!formData.category.trim()}
              />
            </div>

            <div className="form-group">
              <label htmlFor="measure">Medida</label>
              <input
                type="text"
                id="measure"
                name="measure"
                value={formData.measure}
                onChange={handleChange}
                placeholder="Ex: 120 cm"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="price">Preço (R$) *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
              placeholder="0.00"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descrição</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Descrição do produto..."
              required
            />
          </div>

          <div className="form-group">
            <label>Imagens do Produto</label>
            <div className="image-input-group">
              <label htmlFor="product-images-input" className="add-image-btn">
                + Adicionar imagens
              </label>
              <input
                id="product-images-input"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFilesChange}
                hidden
              />
            </div>
            <small>
              {isEditMode
                ? 'Clique no X para remover uma imagem existente ou adicione novas imagens.'
                : 'Selecione uma ou mais imagens do produto.'}
            </small>

            {(existingImages.length > 0 || imagePreviews.length > 0) && (
              <div className="image-list">
                {existingImages.map((url) => (
                  <div key={url} className="image-item">
                    <img src={url} alt="Imagem atual" />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => removeExistingImage(url)}
                      title="Remover imagem"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {imagePreviews.map((url, index) => (
                  <div key={url} className="image-item">
                    <img src={url} alt={`Nova imagem ${index + 1}`} />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => removeNewImage(index)}
                      title="Remover imagem"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancelar
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Produto'}
            </button>
          </div>
      </form>
    </section>
  );
}

export default ProductForm;
