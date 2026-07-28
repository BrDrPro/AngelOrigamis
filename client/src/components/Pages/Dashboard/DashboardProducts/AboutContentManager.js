import React, { useEffect, useState } from 'react';
import { fetchAboutContent, updateAboutContent } from '../../../../api/about';
import EmojiPicker from '../EmojiPicker/EmojiPicker';

function AboutContentManager() {
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAboutContent()
      .then(setDraft)
      .catch((err) => {
        console.error('Erro ao buscar conteúdo da página Sobre:', err);
        setError('Não foi possível carregar o conteúdo da página Sobre.');
      })
      .finally(() => setLoading(false));
  }, []);

  const updateCard = (index, field, value) => {
    setDraft((prev) => ({
      ...prev,
      philosophyCards: prev.philosophyCards.map((card, i) =>
        i === index ? { ...card, [field]: value } : card
      ),
    }));
  };

  const updateParagraph = (index, value) => {
    setDraft((prev) => ({
      ...prev,
      originStoryParagraphs: prev.originStoryParagraphs.map((p, i) => (i === index ? value : p)),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const updated = await updateAboutContent(draft);
      setDraft(updated);
      setMessage('Conteúdo da página Sobre atualizado com sucesso.');
    } catch (err) {
      console.error('Erro ao atualizar conteúdo da página Sobre:', err);
      setError(err.data?.message || 'Não foi possível salvar as alterações.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="empty-state">Carregando...</p>;
  if (!draft) return <p className="empty-state">{error || 'Não foi possível carregar.'}</p>;

  return (
    <div className="settings-form settings-form-wide">
      <div className="form-group">
        <label>Título do topo</label>
        <input
          type="text"
          value={draft.heroTitle}
          onChange={(e) => setDraft((prev) => ({ ...prev, heroTitle: e.target.value }))}
        />
      </div>

      <div className="form-group">
        <label>Biografia</label>
        <textarea
          rows={8}
          value={draft.heroBio}
          onChange={(e) => setDraft((prev) => ({ ...prev, heroBio: e.target.value }))}
        />
      </div>

      <h4 className="content-subheading">Cards de "Nossa Filosofia"</h4>
      {draft.philosophyCards.map((card, index) => (
        <div key={index} className="content-card-editor">
          <div className="form-group">
            <label>Ícone</label>
            <EmojiPicker value={card.icon} onChange={(emoji) => updateCard(index, 'icon', emoji)} />
          </div>
          <div className="form-group">
            <label>Título</label>
            <input
              type="text"
              value={card.title}
              onChange={(e) => updateCard(index, 'title', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Texto</label>
            <textarea
              rows={2}
              value={card.text}
              onChange={(e) => updateCard(index, 'text', e.target.value)}
            />
          </div>
        </div>
      ))}

      <h4 className="content-subheading">Parágrafos de "A Arte do Origami"</h4>
      {draft.originStoryParagraphs.map((paragraph, index) => (
        <div key={index} className="form-group">
          <label>Parágrafo {index + 1}</label>
          <textarea
            rows={3}
            value={paragraph}
            onChange={(e) => updateParagraph(index, e.target.value)}
          />
        </div>
      ))}

      <h4 className="content-subheading">Chamada final</h4>
      <div className="form-group">
        <label>Título</label>
        <input
          type="text"
          value={draft.ctaTitle}
          onChange={(e) => setDraft((prev) => ({ ...prev, ctaTitle: e.target.value }))}
        />
      </div>
      <div className="form-group">
        <label>Texto</label>
        <input
          type="text"
          value={draft.ctaText}
          onChange={(e) => setDraft((prev) => ({ ...prev, ctaText: e.target.value }))}
        />
      </div>

      {message && <p className="settings-success">{message}</p>}
      {error && <p className="settings-error">{error}</p>}

      <div className="quick-actions">
        <button className="action-btn" onClick={handleSave} disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar página Sobre'}
        </button>
      </div>
    </div>
  );
}

export default AboutContentManager;
