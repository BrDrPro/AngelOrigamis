import React, { useEffect, useState } from 'react';
import './About.css';
import './AboutResponsive.css';
import { useNavigate } from 'react-router-dom';
import { fetchAboutContent } from '../../../api/about';

function About() {
  const navigate = useNavigate();
  const [content, setContent] = useState(null);

  useEffect(() => {
    fetchAboutContent().then(setContent).catch(console.error);
  }, []);

  function handleGoToProducts() {
    navigate('/services');
    window.scrollTo(0, 0);
  }

  if (!content) {
    return <div className="about-container" />;
  }

  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content about-hero-flex">
          <div className="about-hero-image">
            <img
              src={content.heroImageUrl || '/assets/SobreAArtista.jpg'}
              alt="Angel trabalhando com origamis"
            />
          </div>
          <div className="about-hero-text">
            <h1>{content.heroTitle}</h1>
            <p>{content.heroBio}</p>
          </div>
        </div>
      </section>

      {/* Philosophy & Values */}
      <section className="about-section mission-section">
        <div className="about-content">
          <h2>Nossa Filosofia</h2>
          <div className="values-container">
            {content.philosophyCards.map((card, index) => (
              <div className="value-card" key={index}>
                <div className="value-icon">{card.icon}</div>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Art of Origami - Nova Seção */}
      <section className="about-section">
        <div className="about-content">
          <h2>A Arte do Origami</h2>
          <div className="about-origami">
            <div className="about-origami-container">
              <img
                src={content.originStoryImageUrl || '/assets/CasamentoMeB.jpg'}
                alt="Origami em casamento"
                className="about-origami-img"
              />
            </div>
            <div className="about-text">
              {content.originStoryParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="about-cta">
        <h2>{content.ctaTitle}</h2>
        <p>{content.ctaText}</p>
        <button className="cta-button" onClick={handleGoToProducts}>
          Ver Produtos
        </button>
      </section>
    </div>
  );
}

export default About;
