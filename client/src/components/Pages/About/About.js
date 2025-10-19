import React from 'react';
import './About.css';
import './AboutResponsive.css';
import { useNavigate } from 'react-router-dom';

function About() {
  const navigate = useNavigate();

  function handleGoToProducts() {
    navigate('/services');
    window.scrollTo(0, 0);
  }

  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content about-hero-flex">
          <div className="about-hero-image">
            <img src="/assets/SobreAArtista.jpg" alt="Angel trabalhando com origamis" />
          </div>
          <div className="about-hero-text">
            <h1>Sobre a Angel</h1>
            <p>
              Desde muito cedo, Angel já carregava nas mãos o dom de transformar materiais simples em algo cheio de vida e significado. Aos 10 anos de idade, movida pela curiosidade e pela paixão por trabalhos manuais, buscou aprender bordado com quem pudesse lhe ensinar. Pouco tempo depois, já se aventurava pelo tricô e pelo crochê, descobrindo o prazer de criar com as próprias mãos.
              Em 2009, foi apresentada ao origami por uma amiga de trabalho e se apaixonou imediatamente pela delicadeza e pela poesia que existe em cada dobra de papel. Desde então, mergulhou nesse universo, conheceu artistas inspiradores e desenvolveu seu próprio olhar — sempre com a ideia de usar o origami para dar vida e encanto à decoração de ambientes.
              Por muitos anos, suas criações — origamis, tricôs, crochês e outras artes — foram presentes reservados para familiares e amigos próximos, carregando em cada peça o carinho e a dedicação de quem cria com amor. Mas chegou a hora de expandir.
              Este site nasceu para que mais pessoas possam conhecer e se encantar com seu trabalho. Aqui, cada peça carrega um pedacinho da história de Angel e o desejo de levar beleza, aconchego e afeto para dentro de novos lares.
              Porque, para ela, arte é isso: um gesto de cuidado que aproxima, aquece e transforma.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy & Values */}
      <section className="about-section mission-section">
        <div className="about-content">
          <h2>Nossa Filosofia</h2>
          <div className="values-container">
            <div className="value-card">
              <div className="value-icon">🎋</div>
              <h3>Tradição</h3>
              <p>Respeito às técnicas tradicionais e seus significados culturais</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🌱</div>
              <h3>Sustentabilidade</h3>
              <p>Uso consciente de materiais e processos de baixo impacto ambiental</p>
            </div>
            <div className="value-card">
              <div className="value-icon">✨</div>
              <h3>Significado</h3>
              <p>Cada peça carrega uma história e um desejo positivo para quem a recebe</p>
            </div>
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
                src="/assets/CasamentoMeB.jpg"
                alt="Origami em casamento"
                className="about-origami-img"
              />
            </div>
            <div className="about-text">
              <p>O origami é mais que um simples passatempo - é uma forma de meditação ativa, que desenvolve paciência, concentração e habilidades motoras. Cada peça de papel dobrada contém uma intenção e um significado especial.</p>
              <p>O tsuru (grou de papel), por exemplo, é um símbolo de saúde, boa sorte e longevidade. Segundo a tradição japonesa, quem dobra mil tsurus tem um desejo realizado. Essa é apenas uma das muitas histórias e significados que acompanham a arte do origami.</p>
              <p>Em nosso trabalho, buscamos preservar esses significados e tradições, trazendo um pedaço dessa cultura milenar para o seu dia a dia.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="about-cta">
        <h2>Transforme papel em arte</h2>
        <p>Conheça nossos produtos artesanais</p>
        <button className="cta-button" onClick={handleGoToProducts}>
          Ver Produtos
        </button>
      </section>
    </div>
  );
}

export default About;