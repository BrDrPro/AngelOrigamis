import React, { useCallback, useEffect, useState } from 'react';
import { fetchFaqs, createFaq, updateFaq, deleteFaq } from '../../../../api/faqs';

const EMPTY_FAQ_DRAFT = { question: '', answer: '', order: 0 };

function FaqManager() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(EMPTY_FAQ_DRAFT);
  const [showNewForm, setShowNewForm] = useState(false);
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadFaqs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchFaqs();
      setFaqs(data);
    } catch (err) {
      console.error('Erro ao buscar FAQ:', err);
      setError('Não foi possível carregar o FAQ.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFaqs();
  }, [loadFaqs]);

  const startEdit = (faq) => {
    setShowNewForm(false);
    setEditingId(faq.id);
    setDraft({ question: faq.question, answer: faq.answer, order: faq.order });
  };

  const startNew = () => {
    setEditingId(null);
    setDraft({ ...EMPTY_FAQ_DRAFT, order: faqs.length });
    setShowNewForm(true);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setShowNewForm(false);
    setDraft(EMPTY_FAQ_DRAFT);
  };

  const handleSaveEdit = async (id) => {
    if (!draft.question.trim() || !draft.answer.trim()) {
      alert('Pergunta e resposta são obrigatórias.');
      return;
    }
    setSavingId(id);
    try {
      const updated = await updateFaq(id, draft);
      setFaqs((prev) => prev.map((f) => (f.id === id ? updated : f)));
      cancelEdit();
    } catch (err) {
      console.error('Erro ao atualizar FAQ:', err);
      alert('Não foi possível salvar a alteração.');
    } finally {
      setSavingId(null);
    }
  };

  const handleCreate = async () => {
    if (!draft.question.trim() || !draft.answer.trim()) {
      alert('Pergunta e resposta são obrigatórias.');
      return;
    }
    setSavingId('new');
    try {
      const created = await createFaq(draft);
      setFaqs((prev) => [...prev, created]);
      cancelEdit();
    } catch (err) {
      console.error('Erro ao criar FAQ:', err);
      alert('Não foi possível criar a pergunta.');
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta pergunta do FAQ?')) {
      return;
    }
    setDeletingId(id);
    try {
      await deleteFaq(id);
      setFaqs((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error('Erro ao excluir FAQ:', err);
      alert('Não foi possível excluir a pergunta.');
    } finally {
      setDeletingId(null);
    }
  };

  const renderDraftForm = (onSave, saving) => (
    <div className="settings-form settings-form-wide">
      <div className="form-group">
        <label>Pergunta</label>
        <input
          type="text"
          value={draft.question}
          onChange={(e) => setDraft((prev) => ({ ...prev, question: e.target.value }))}
          placeholder="Ex: Qual o prazo de entrega?"
        />
      </div>
      <div className="form-group">
        <label>Resposta</label>
        <textarea
          rows={3}
          value={draft.answer}
          onChange={(e) => setDraft((prev) => ({ ...prev, answer: e.target.value }))}
          placeholder="Resposta para o cliente..."
        />
      </div>
      <div className="form-group">
        <label>Ordem de exibição</label>
        <input
          type="number"
          value={draft.order}
          onChange={(e) => setDraft((prev) => ({ ...prev, order: Number(e.target.value) }))}
          style={{ maxWidth: '120px' }}
        />
      </div>
      <div className="quick-actions">
        <button className="action-btn" onClick={onSave} disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
        <button type="button" className="cancel-btn" onClick={cancelEdit}>
          Cancelar
        </button>
      </div>
    </div>
  );

  return (
    <>
      <h3 className="content-subheading">Perguntas Frequentes (Contato)</h3>
      {loading ? (
        <p className="empty-state">Carregando...</p>
      ) : error ? (
        <p className="empty-state">{error}</p>
      ) : (
        <>
          {faqs.length === 0 ? (
            <p className="empty-state">Nenhuma pergunta cadastrada</p>
          ) : (
            <div className="product-table-wrapper">
              <table className="product-table">
                <thead>
                  <tr>
                    <th>Pergunta</th>
                    <th>Ordem</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {faqs.map((faq) => (
                    <React.Fragment key={faq.id}>
                      <tr>
                        <td>{faq.question}</td>
                        <td>{faq.order}</td>
                        <td className="product-actions">
                          <button className="edit-product-btn" onClick={() => startEdit(faq)}>
                            {editingId === faq.id ? 'Fechar' : 'Editar'}
                          </button>
                          <button
                            className="delete-product-btn"
                            onClick={() => handleDelete(faq.id)}
                            disabled={deletingId === faq.id}
                          >
                            {deletingId === faq.id ? 'Excluindo...' : 'Excluir'}
                          </button>
                        </td>
                      </tr>
                      {editingId === faq.id && (
                        <tr>
                          <td colSpan={3}>{renderDraftForm(() => handleSaveEdit(faq.id), savingId === faq.id)}</td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="quick-actions" style={{ marginTop: '1rem' }}>
            <button className="action-btn" onClick={startNew}>
              <i className="icon">➕</i>
              <span>Adicionar Pergunta</span>
            </button>
          </div>

          {showNewForm && (
            <div style={{ marginTop: '1rem' }}>
              {renderDraftForm(handleCreate, savingId === 'new')}
            </div>
          )}
        </>
      )}
    </>
  );
}

export default FaqManager;
