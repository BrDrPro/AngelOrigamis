import React, { useEffect, useState } from 'react';
import { fetchHomeContent, updateHomeContent } from '../../../../api/homeContent';
import EmojiPicker from '../EmojiPicker/EmojiPicker';

function HomeContentManager() {
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchHomeContent()
      .then(setDraft)
      .catch((err) => {
        console.error('Erro ao buscar conteúdo da Home:', err);
        setError('Não foi possível carregar o conteúdo da Home.');
      })
      .finally(() => setLoading(false));
  }, []);

  const updateCard = (index, field, value) => {
    setDraft((prev) => ({
      ...prev,
      benefitCards: prev.benefitCards.map((card, i) =>
        i === index ? { ...card, [field]: value } : card
      ),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const updated = await updateHomeContent(draft);
      setDraft(updated);
      setMessage('Conteúdo da Home atualizado com sucesso.');
    } catch (err) {
      console.error('Erro ao atualizar conteúdo da Home:', err);
      setError(err.data?.message || 'Não foi possível salvar as alterações.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="empty-state">Carregando...</p>;
  if (!draft) return <p className="empty-state">{error || 'Não foi possível carregar.'}</p>;

  return (
    <div className="settings-form settings-form-wide">
      <h4 className="content-subheading">Topo da página</h4>
      <div className="form-group">
        <label>Título</label>
        <input
          type="text"
          value={draft.heroTitle}
          onChange={(e) => setDraft((prev) => ({ ...prev, heroTitle: e.target.value }))}
        />
      </div>
      <div className="form-group">
        <label>Subtítulo</label>
        <input
          type="text"
          value={draft.heroSubtitle}
          onChange={(e) => setDraft((prev) => ({ ...prev, heroSubtitle: e.target.value }))}
        />
      </div>

      <h4 className="content-subheading">Seção "Por que escolher origami?"</h4>
      <div className="form-group">
        <label>Título da seção</label>
        <input
          type="text"
          value={draft.benefitsTitle}
          onChange={(e) => setDraft((prev) => ({ ...prev, benefitsTitle: e.target.value }))}
        />
      </div>
      {draft.benefitCards.map((card, index) => (
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

      <h4 className="content-subheading">Newsletter</h4>
      <div className="form-group">
        <label>Título</label>
        <input
          type="text"
          value={draft.newsletterTitle}
          onChange={(e) => setDraft((prev) => ({ ...prev, newsletterTitle: e.target.value }))}
        />
      </div>
      <div className="form-group">
        <label>Texto</label>
        <input
          type="text"
          value={draft.newsletterText}
          onChange={(e) => setDraft((prev) => ({ ...prev, newsletterText: e.target.value }))}
        />
      </div>

      {message && <p className="settings-success">{message}</p>}
      {error && <p className="settings-error">{error}</p>}

      <div className="quick-actions">
        <button className="action-btn" onClick={handleSave} disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar página Home'}
        </button>
      </div>
    </div>
  );
}

export default HomeContentManager;
