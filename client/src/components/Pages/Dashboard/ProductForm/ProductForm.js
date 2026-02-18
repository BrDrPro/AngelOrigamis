import React, { useState } from 'react';
import './ProductForm.css';

function ProductForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    measure: 'un',
    imageUrls: []
  });
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Buquês',
    'Decoração de Natal',
    'Origamis Diversos',
    'Arranjos Decorativos',
    'Presentes Personalizados'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        imageUrls: [...prev.imageUrls, imageUrl.trim()]
      }));
      setImageUrl('');
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const apiUrl = process.env.NODE_ENV === 'production'
        ? 'https://angelorigamis.com.br/api/products'
        : 'http://localhost:3001/api/products';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price)
        })
      });

      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        const data = await response.json();
        setError(data.message || 'Erro ao criar produto');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
      console.error('Erro ao criar produto:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Adicionar Novo Produto</h2>
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
              <label htmlFor="measure">Unidade de Medida</label>
              <select
                id="measure"
                name="measure"
                value={formData.measure}
                onChange={handleChange}
              >
                <option value="un">Unidade</option>
                <option value="dz">Dúzia</option>
                <option value="cx">Caixa</option>
              </select>
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
            />
          </div>

          <div className="form-group">
            <label>Imagens do Produto</label>
            <div className="image-input-group">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Cole a URL da imagem"
              />
              <button type="button" onClick={handleAddImage} className="add-image-btn">
                Adicionar
              </button>
            </div>

            {formData.imageUrls.length > 0 && (
              <div className="image-list">
                {formData.imageUrls.map((url, index) => (
                  <div key={index} className="image-item">
                    <img src={url} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="remove-image-btn"
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
      </div>
    </div>
  );
}

export default ProductForm;