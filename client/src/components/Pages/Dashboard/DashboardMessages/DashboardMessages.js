import React, { useCallback, useEffect, useState } from 'react';
import {
  fetchAllTestimonials,
  approveTestimonial,
  deleteTestimonial
} from '../../../../api/testimonials';
import {
  fetchContactRequests,
  markContactRequestRead,
  deleteContactRequest
} from '../../../../api/contactRequests';
import Pagination, { usePagination } from '../Pagination/Pagination';

function DashboardMessages() {
  const [testimonials, setTestimonials] = useState([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  const [testimonialsError, setTestimonialsError] = useState('');
  const [testimonialActionId, setTestimonialActionId] = useState(null);
  const [contactRequests, setContactRequests] = useState([]);
  const [contactRequestsLoading, setContactRequestsLoading] = useState(true);
  const [contactRequestsError, setContactRequestsError] = useState('');
  const [contactRequestActionId, setContactRequestActionId] = useState(null);
  const { page: testimonialsPage, setPage: setTestimonialsPage, totalPages: testimonialsTotalPages, pageItems: pagedTestimonials } = usePagination(testimonials);
  const { page: requestsPage, setPage: setRequestsPage, totalPages: requestsTotalPages, pageItems: pagedRequests } = usePagination(contactRequests);

  const loadTestimonials = useCallback(async () => {
    setTestimonialsLoading(true);
    setTestimonialsError('');
    try {
      const data = await fetchAllTestimonials();
      setTestimonials(data);
    } catch (error) {
      console.error('Erro ao buscar recados:', error);
      setTestimonialsError('Não foi possível carregar os recados.');
    } finally {
      setTestimonialsLoading(false);
    }
  }, []);

  const loadContactRequests = useCallback(async () => {
    setContactRequestsLoading(true);
    setContactRequestsError('');
    try {
      const data = await fetchContactRequests();
      setContactRequests(data);
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      setContactRequestsError('Não foi possível carregar as mensagens.');
    } finally {
      setContactRequestsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTestimonials();
    loadContactRequests();
  }, [loadTestimonials, loadContactRequests]);

  const handleApproveTestimonial = async (id) => {
    setTestimonialActionId(id);
    try {
      await approveTestimonial(id);
      setTestimonials((prev) =>
        prev.map((t) => (t.id === id ? { ...t, approved: true } : t))
      );
    } catch (error) {
      console.error('Erro ao aprovar recado:', error);
      alert('Não foi possível aprovar o recado.');
    } finally {
      setTestimonialActionId(null);
    }
  };

  const handleDeleteTestimonial = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este recado?')) {
      return;
    }

    setTestimonialActionId(id);
    try {
      await deleteTestimonial(id);
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error('Erro ao excluir recado:', error);
      alert('Não foi possível excluir o recado.');
    } finally {
      setTestimonialActionId(null);
    }
  };

  const handleMarkRequestRead = async (id) => {
    setContactRequestActionId(id);
    try {
      await markContactRequestRead(id);
      setContactRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, read: true } : r))
      );
    } catch (error) {
      console.error('Erro ao marcar mensagem como lida:', error);
      alert('Não foi possível marcar a mensagem como lida.');
    } finally {
      setContactRequestActionId(null);
    }
  };

  const handleDeleteRequest = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta mensagem?')) {
      return;
    }

    setContactRequestActionId(id);
    try {
      await deleteContactRequest(id);
      setContactRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error('Erro ao excluir mensagem:', error);
      alert('Não foi possível excluir a mensagem.');
    } finally {
      setContactRequestActionId(null);
    }
  };

  return (
    <>
      <header className="dashboard-header">
        <h1>Mensagens</h1>
        <p className="dashboard-subtitle">Recados do mural público e pedidos de orçamento</p>
      </header>

      <div className="dashboard-content">
        <section className="content-section">
          <h2>Recados (Mural Público)</h2>
          {testimonialsLoading ? (
            <p className="empty-state">Carregando recados...</p>
          ) : testimonialsError ? (
            <p className="empty-state">{testimonialsError}</p>
          ) : testimonials.length === 0 ? (
            <p className="empty-state">Nenhum recado recebido</p>
          ) : (
            <div className="product-table-wrapper">
              <table className="product-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Recado</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {pagedTestimonials.map((t) => (
                    <tr key={t.id}>
                      <td>{t.name}</td>
                      <td>{t.message}</td>
                      <td>{t.approved ? 'Aprovado' : 'Pendente'}</td>
                      <td className="product-actions">
                        {!t.approved && (
                          <button
                            className="edit-product-btn"
                            onClick={() => handleApproveTestimonial(t.id)}
                            disabled={testimonialActionId === t.id}
                          >
                            {testimonialActionId === t.id ? 'Aprovando...' : 'Aprovar'}
                          </button>
                        )}
                        <button
                          className="delete-product-btn"
                          onClick={() => handleDeleteTestimonial(t.id)}
                          disabled={testimonialActionId === t.id}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination page={testimonialsPage} totalPages={testimonialsTotalPages} onChange={setTestimonialsPage} />
            </div>
          )}
        </section>

        <section className="content-section">
          <h2>Mensagens de Contato</h2>
          {contactRequestsLoading ? (
            <p className="empty-state">Carregando mensagens...</p>
          ) : contactRequestsError ? (
            <p className="empty-state">{contactRequestsError}</p>
          ) : contactRequests.length === 0 ? (
            <p className="empty-state">Nenhuma mensagem recebida</p>
          ) : (
            <div className="product-table-wrapper">
              <table className="product-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>Produto</th>
                    <th>Detalhes</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {pagedRequests.map((r) => (
                    <tr key={r.id} className={r.read ? '' : 'unread-row'}>
                      <td>{r.name}</td>
                      <td>{r.email}</td>
                      <td>{r.productType}</td>
                      <td>{r.details}</td>
                      <td className="product-actions">
                        {!r.read && (
                          <button
                            className="edit-product-btn"
                            onClick={() => handleMarkRequestRead(r.id)}
                            disabled={contactRequestActionId === r.id}
                          >
                            Marcar lida
                          </button>
                        )}
                        <button
                          className="delete-product-btn"
                          onClick={() => handleDeleteRequest(r.id)}
                          disabled={contactRequestActionId === r.id}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination page={requestsPage} totalPages={requestsTotalPages} onChange={setRequestsPage} />
            </div>
          )}
        </section>
      </div>
    </>
  );
}

export default DashboardMessages;
