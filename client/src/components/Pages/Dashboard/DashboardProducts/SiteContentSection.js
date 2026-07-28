import React, { useState } from 'react';
import FaqManager from './FaqManager';
import AboutContentManager from './AboutContentManager';
import HomeContentManager from './HomeContentManager';

const CONTENT_TABS = [
  { id: 'faq', label: 'FAQ (Contato)' },
  { id: 'sobre', label: 'Página Sobre' },
  { id: 'home', label: 'Página Home' },
];

function SiteContentSection() {
  const [activeTab, setActiveTab] = useState('faq');

  return (
    <section className="content-section">
      <h2>Conteúdo do Site</h2>
      <p className="section-hint">
        Edite aqui os textos que aparecem no site pros seus clientes.
      </p>

      <div className="quick-actions">
        {CONTENT_TABS.map((tab) => (
          <button
            key={tab.id}
            className={`action-btn${activeTab === tab.id ? ' action-btn-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        {activeTab === 'faq' && <FaqManager />}
        {activeTab === 'sobre' && <AboutContentManager />}
        {activeTab === 'home' && <HomeContentManager />}
      </div>
    </section>
  );
}

export default SiteContentSection;
