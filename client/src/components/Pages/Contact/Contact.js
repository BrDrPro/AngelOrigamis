import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Contact.css';
import './ContactResponsive.css';

function Contact() {
  const [selectedForm, setSelectedForm] = useState('recado');
  const [nomeZap, setNomeZap] = useState('');
  const [msgZap, setMsgZap] = useState('');

  // Campos para encomenda personalizada
  const [nomeEncomenda, setNomeEncomenda] = useState('');
  const [emailEncomenda, setEmailEncomenda] = useState('');
  const [produtoEncomenda, setProdutoEncomenda] = useState('origami');
  const [detalhesEncomenda, setDetalhesEncomenda] = useState('');

  // Campos para recado
  const [nomeRecado, setNomeRecado] = useState('');
  const [msgRecado, setMsgRecado] = useState('');
  const [recadoEnviado, setRecadoEnviado] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const formParam = params.get('form');
    if (formParam === 'encomenda') setSelectedForm('encomenda');
  }, [location.search]);

  function handleWhatsApp(e) {
    e.preventDefault();
    const nome = nomeZap.trim();
    const mensagem = msgZap.trim();
    const texto = encodeURIComponent(
      `Olá, meu nome é ${nome}.\n${mensagem}`
    );
    window.open(`https://wa.me/5531971842477?text=${texto}`, '_blank');
  }

  function handleEncomendaWhatsApp(e) {
    e.preventDefault();
    const texto = encodeURIComponent(
      `Solicitação de Orçamento:\n` +
      `Nome: ${nomeEncomenda}\n` +
      `E-mail: ${emailEncomenda}\n` +
      `Produto: ${produtoEncomenda}\n` +
      `Detalhes: ${detalhesEncomenda}`
    );
    window.open(`https://wa.me/5531971842477?text=${texto}`, '_blank');
  }

  function handleRecadoSubmit(e) {
    e.preventDefault();
    if (!nomeRecado.trim() || !msgRecado.trim()) return;
    const novoRecado = {
      nome: nomeRecado.trim(),
      mensagem: msgRecado.trim(),
      data: new Date().toISOString()
    };
    // Salva no localStorage
    const recados = JSON.parse(localStorage.getItem('recadosAngel') || '[]');
    recados.unshift(novoRecado); // adiciona no início
    localStorage.setItem('recadosAngel', JSON.stringify(recados));
    setRecadoEnviado(true);
    setNomeRecado('');
    setMsgRecado('');
    setTimeout(() => setRecadoEnviado(false), 2500);
  }

  return (
    <div className="contact-container">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="contact-hero-content">
          <h1>Fale Conosco</h1>
          <p>Estamos à disposição para encomendas, recados e informações sobre nossos trabalhos artesanais</p>
        </div>
      </section>

      {/* Seletores de formulário */}
      <div className="contact-selects">
        <button
          className={`contact-select-btn${selectedForm === 'recado' ? ' active' : ''}`}
          onClick={() => setSelectedForm('recado')}
        >
          Deixe um recado
        </button>
        <button
          className={`contact-select-btn${selectedForm === 'encomenda' ? ' active' : ''}`}
          onClick={() => setSelectedForm('encomenda')}
        >
          Encomenda personalizada
        </button>
        <button
          className={`contact-select-btn${selectedForm === 'whatsapp' ? ' active' : ''}`}
          onClick={() => setSelectedForm('whatsapp')}
        >
          Vamos conversar
        </button>
      </div>

      <section className="contact-main contact-main-centered">
        <div className="contact-form-container contact-form-expanded">
          {selectedForm === 'recado' && (
            <>
              <h2>Deixe um Recado</h2>
              <form className="contact-form" onSubmit={handleRecadoSubmit}>
                <div className="form-group">
                  <label htmlFor="nomeRecado">Nome</label>
                  <input
                    type="text"
                    id="nomeRecado"
                    name="nomeRecado"
                    required
                    value={nomeRecado}
                    onChange={e => setNomeRecado(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="recado">Seu recado</label>
                  <textarea
                    id="recado"
                    name="recado"
                    rows="5"
                    required
                    placeholder="Deixe sua mensagem para aparecer na nossa página inicial!"
                    value={msgRecado}
                    onChange={e => setMsgRecado(e.target.value.slice(0, 120))}
                    maxLength={120}
                  />
                  <div className="char-counter">{msgRecado.length}/120</div>
                </div>
                <button type="submit" className="submit-button">Enviar Recado</button>
                {recadoEnviado && (
                  <div style={{ color: 'var(--verde-logo)', marginTop: 10, textAlign: 'center' }}>
                    Recado enviado! Obrigado pelo carinho 💖
                  </div>
                )}
              </form>
            </>
          )}

          {selectedForm === 'encomenda' && (
            <>
              <h2>Encomende Seu Origami</h2>
              <form className="contact-form" onSubmit={handleEncomendaWhatsApp}>
                <div className="form-group">
                  <label htmlFor="name">Nome</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={nomeEncomenda}
                    onChange={e => setNomeEncomenda(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">E-mail</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={emailEncomenda}
                    onChange={e => setEmailEncomenda(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Tipo de Produto</label>
                  <select
                    id="subject"
                    name="subject"
                    value={produtoEncomenda}
                    onChange={e => setProdutoEncomenda(e.target.value)}
                  >
                    <option value="origami">Origami</option>
                    <option value="cadeira">Cadeira Trançada</option>
                    <option value="quadro">Quadro</option>
                    <option value="porta-retrato">Porta-retrato</option>
                    <option value="caixa">Caixa Artesanal</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="message">Detalhes da Encomenda</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    required
                    placeholder="Descreva o que deseja, tamanhos, cores e qualquer detalhe importante para sua encomenda."
                    value={detalhesEncomenda}
                    onChange={e => setDetalhesEncomenda(e.target.value)}
                  ></textarea>
                </div>
                <button type="submit" className="submit-button">Solicitar Orçamento</button>
              </form>
            </>
          )}

          {selectedForm === 'whatsapp' && (
            <>
              <h2>Vamos Conversar</h2>
              <form className="contact-form" onSubmit={handleWhatsApp}>
                <div className="form-group">
                  <label htmlFor="nomeZap">Nome</label>
                  <input
                    type="text"
                    id="nomeZap"
                    name="nomeZap"
                    required
                    value={nomeZap}
                    onChange={e => setNomeZap(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="msgZap">Mensagem</label>
                  <textarea
                    id="msgZap"
                    name="msgZap"
                    rows="5"
                    required
                    placeholder="Digite sua mensagem para enviar direto no WhatsApp"
                    value={msgZap}
                    onChange={e => setMsgZap(e.target.value)}
                  ></textarea>
                </div>
                <button type="submit" className="submit-button">Abrir WhatsApp</button>
              </form>
            </>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <h2>Perguntas Frequentes</h2>
        <div className="faq-container">
          <div className="faq-item">
            <h3>Qual o prazo para entrega de origamis personalizados?</h3>
            <p>O prazo varia conforme a complexidade e quantidade. Origamis simples podem ser feitos em 1-2 dias, peças mais complexas podem levar até 2 semanas.</p>
          </div>
          <div className="faq-item">
            <h3>Os origamis são duráveis?</h3>
            <p>Sim! Utilizamos papéis especiais que garantem durabilidade. Para maior conservação, recomendamos manter em local seco e protegido do sol direto.</p>
          </div>
          <div className="faq-item">
            <h3>Fazem workshops de origami?</h3>
            <p>Sim, oferecemos workshops para grupos pequenos e eventos. Entre em contato para mais informações sobre datas e preços.</p>
          </div>
          <div className="faq-item">
            <h3>Posso encomendar produtos para presente?</h3>
            <p>Com certeza! Oferecemos embalagens especiais e podemos incluir cartões personalizados em suas encomendas.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;