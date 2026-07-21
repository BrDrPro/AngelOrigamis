import React, { useEffect, useMemo, useState } from 'react';
import './ProductForm.css';
import { createProduct, updateProduct } from '../../../../api/products';

function ProductForm({ product, onClose, onSuccess }) {
  const isEditMode = Boolean(product);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    subcategory: '',
    measure: '',
    categoryFolder: '',
    subcategoryFolder: ''
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categoryFolderDirty, setCategoryFolderDirty] = useState(false);
  const [subcategoryFolderDirty, setSubcategoryFolderDirty] = useState(false);

  const categories = [
    'Móbiles',
    'Mandalas',
    'Kussudamas',
    'Colares de Mesa',
    'Escapulários de Porta',
    'Adornos de Porta e/ou Berço',
    'Quadros de Origami',
    'Filtros dos Sonhos',
    'Material de Escritório',
    'Cadeira de Praia em Fio Náutico',
    'Decoração de Natal'
  ];

  const categoryFolderMap = useMemo(() => ({
    'Móbiles': 'Mobilis',
    'Mandalas': 'Mandalas',
    'Kussudamas': 'Kussudamas',
    'Colares de Mesa': 'ColaresdeMesa',
    'Escapulários de Porta': 'EscapuláriodePorta',
    'Adornos de Porta e/ou Berço': 'AdornosdeBerçoePorta',
    'Quadros de Origami': 'Quadros',
    'Filtros dos Sonhos': 'FiltrodosSonhos',
    'Material de Escritório': 'MaterialEscritório',
    'Cadeira de Praia em Fio Náutico': 'CadeirasdePraia',
    'Decoração de Natal': 'Natal'
  }), []);

  const normalizeFolder = (value) => {
    if (!value) return '';
    return value
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/\s+/g, '')
      .replace(/[\\/]/g, '')
      .trim();
  };

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price != null ? String(product.price) : '',
        category: product.category || '',
        subcategory: product.subcategory || '',
        measure: product.measure || '',
        categoryFolder: categoryFolderMap[product.category] || normalizeFolder(product.category) || '',
        subcategoryFolder: normalizeFolder(product.subcategory) || ''
      });
    }
  }, [product, categoryFolderMap]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'categoryFolder') {
      setCategoryFolderDirty(true);
    }

    if (name === 'subcategoryFolder') {
      setSubcategoryFolderDirty(true);
    }

    if (name === 'category') {
      setCategoryFolderDirty(false);
    }

    if (name === 'subcategory') {
      setSubcategoryFolderDirty(false);
    }
  };

  const handleFilesChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    setImages(selectedFiles);
  };

  useEffect(() => {
    const previews = images.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);

    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  useEffect(() => {
    if (formData.category && !categoryFolderDirty) {
      const suggested = categoryFolderMap[formData.category] || normalizeFolder(formData.category);
      setFormData((prev) => ({
        ...prev,
        categoryFolder: suggested
      }));
    }
  }, [formData.category, categoryFolderDirty, categoryFolderMap]);

  useEffect(() => {
    if (formData.subcategory && !subcategoryFolderDirty) {
      const suggested = normalizeFolder(formData.subcategory);
      setFormData((prev) => ({
        ...prev,
        subcategoryFolder: suggested
      }));
    }
  }, [formData.subcategory, subcategoryFolderDirty]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!isEditMode && images.length === 0) {
        setError('Selecione pelo menos uma imagem.');
        setLoading(false);
        return;
      }

      if (!formData.description.trim()) {
        setError('A descrição é obrigatória.');
        setLoading(false);
        return;
      }

      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('description', formData.description);
      payload.append('price', String(parseFloat(formData.price)));
      payload.append('category', formData.category);
      payload.append('subcategory', formData.subcategory);
      payload.append('measure', formData.measure);
      payload.append('categoryFolder', formData.categoryFolder);
      payload.append('subcategoryFolder', formData.subcategoryFolder);
      images.forEach((file) => payload.append('images', file));

      if (isEditMode) {
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditMode ? 'Editar Produto' : 'Adicionar Novo Produto'}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

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
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Selecione uma categoria</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="subcategory">Subcategoria</label>
              <input
                type="text"
                id="subcategory"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                placeholder="Ex: Margaridas"
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

          <div className="form-row">
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
              <label htmlFor="categoryFolder">Pasta da Categoria *</label>
              <input
                type="text"
                id="categoryFolder"
                name="categoryFolder"
                value={formData.categoryFolder}
                onChange={handleChange}
                required
                placeholder="Ex: Mobilis"
              />
              <small>Use o nome exato da pasta em public/Produtos.</small>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="subcategoryFolder">Pasta da Subcategoria</label>
              <input
                type="text"
                id="subcategoryFolder"
                name="subcategoryFolder"
                value={formData.subcategoryFolder}
                onChange={handleChange}
                placeholder="Ex: Margaridas"
              />
              <small>Opcional. Preencha apenas se existir subpasta.</small>
            </div>
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
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFilesChange}
            />
            {isEditMode && (
              <small>Deixe em branco para manter as imagens atuais. Selecionar novas imagens substitui todas as atuais.</small>
            )}

            {imagePreviews.length > 0 ? (
              <div className="image-list">
                {imagePreviews.map((url, index) => (
                  <div key={index} className="image-item">
                    <img src={url} alt={`Preview ${index + 1}`} />
                  </div>
                ))}
              </div>
            ) : isEditMode && product.imageUrls && product.imageUrls.length > 0 ? (
              <div className="image-list">
                {product.imageUrls.map((url, index) => (
                  <div key={index} className="image-item">
                    <img src={url} alt={`Imagem atual ${index + 1}`} />
                  </div>
                ))}
              </div>
            ) : null}
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
      </div>
    </div>
  );
}

export default ProductForm;
