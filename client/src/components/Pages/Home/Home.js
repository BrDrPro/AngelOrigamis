import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import './HomeResponsive.css'
import { CartContext } from '../../CartContext/CartContext';
import { fetchProducts } from '../../../api/products';
import { fetchTestimonials } from '../../../api/testimonials';
import { apiFetch } from '../../../api/apiClient';

function Home() {
  // Estado para controlar o índice inicial visível no carrossel
  const [startIndex, setStartIndex] = useState(0);
  const { addToCart } = useContext(CartContext);
  const [addedMsg, setAddedMsg] = useState(false);
  const [recados, setRecados] = useState([]);
  const [recadoStartIndex, setRecadoStartIndex] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [carouselPaused, setCarouselPaused] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterMsg, setNewsletterMsg] = useState('');
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Definir produtos em destaque iniciais
  useEffect(() => {
    fetchProducts()
      .then(setFeaturedProducts)
      .catch(console.error);
  }, []);

  // Número de itens visíveis ao mesmo tempo
  const itemsPerView = 3;
  
  // Cálculo do número máximo de páginas de carrossel
  const maxIndex = Math.max(0, featuredProducts.length - itemsPerView);

  // Função para avançar para os próximos itens
  const nextSlide = useCallback(() => {
    setStartIndex(prevIndex =>
      prevIndex >= maxIndex ? 0 : prevIndex + 1
    );
  }, [maxIndex]);

  // Função para voltar para os itens anteriores
  const prevSlide = () => {
    setStartIndex(prevIndex => 
      prevIndex <= 0 ? maxIndex : prevIndex - 1
    );
  };

  // Mudança automática a cada 5 segundos
  useEffect(() => {
    if (carouselPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselPaused, nextSlide]);

  // Calcular quais produtos estão visíveis no momento
  const visibleProducts = [];
  if (featuredProducts.length > 0) {
    // Filtra produtos que possuem pelo menos uma imagem válida
    const productsWithImage = featuredProducts.filter(
      p => Array.isArray(p.imageUrls) && p.imageUrls[0]
    );
    for (let i = 0; i < itemsPerView; i++) {
      const index = (startIndex + i) % productsWithImage.length;
      visibleProducts.push(productsWithImage[index]);
    }
  }

  function handleAdd(product) {
    addToCart(product);
    setAddedMsg(true);
    setTimeout(() => setAddedMsg(false), 2000); // mensagem desaparece após 2s
  }

  useEffect(() => {
    fetchTestimonials()
      .then(setRecados)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (recados.length > 5) {
      setRecadoStartIndex(recados.length - 5);
    } else {
      setRecadoStartIndex(0);
    }
  }, [recados.length]);

  // Transição automática
  useEffect(() => {
    if (recados.length <= 5) return;
    const interval = setInterval(() => {
      setRecadoStartIndex(prev => {
        if (prev >= recados.length - 5) return 0;
        return prev + 1;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [recados]);

  // Carrossel de recados - sempre 5, circular, sem duplicidade
  let visibleRecados = [];
  if (recados.length > 0) {
    if (recados.length >= 5) {
      for (let i = 0; i < 5; i++) {
        const idx = (recadoStartIndex + i) % recados.length;
        visibleRecados.push(recados[idx]);
      }
    } else {
      // Menos de 5 recados: mostra todos, sem repetir
      visibleRecados = [...recados];
    }
  }

  async function handleNewsletterSubmit(e) {
    e.preventDefault();
    try {
      await apiFetch('/newsletter', { method: 'POST', body: { email: newsletterEmail } });
      setNewsletterMsg('Inscrição realizada com sucesso!');
      setNewsletterEmail('');
    } catch (err) {
      setNewsletterMsg('Erro ao inscrever. Tente novamente.');
    }
  }

  // Supondo que cada produto tem a propriedade 'category'
  function getRandomProductsByCategory(products) {
    const grouped = {};
    products.forEach(prod => {
      if (!grouped[prod.category]) grouped[prod.category] = [];
      grouped[prod.category].push(prod);
    });

    // Seleciona um produto aleatório de cada categoria
    return Object.values(grouped).map(categoryProducts => {
      const idx = Math.floor(Math.random() * categoryProducts.length);
      return categoryProducts[idx];
    });
  }

  // No useEffect ou onde você carrega os produtos:
  useEffect(() => {
    fetchProducts()
      .then(allProducts => {
        setFeaturedProducts(getRandomProductsByCategory(allProducts));
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const productsToShow = isMobile ? featuredProducts : visibleProducts;

  return (
    <>
      <div className="home-container">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <h1>Arte em Papel e Artesanato</h1>
            <p>Origamis exclusivos feitos com dedicação e significado</p>
            <Link to="/services" className="cta-button">Ver Produtos</Link>
          </div>
        </section>

        {/* Carrossel de Produtos em Destaque */}
        <section className="featured-products">
          <h2>Criações em Destaque</h2>
          <div className="carousel-container">
            {/* Botões só aparecem em telas grandes */}
            {window.innerWidth > 768 && (
              <button className="carousel-button prev" onClick={prevSlide}>
                &#10094;
              </button>
            )}

            <div className="carousel-track">
              {productsToShow.map((product) => (
                <div key={product.id} className="carousel-item">
                  <div
                    className="product-card"
                    onClick={() => {
                      setExpandedProduct(product);
                      setCarouselPaused(true);
                      setModalImageIndex(0);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div
                      className="product-image-container"
                      style={{
                        backgroundImage: `url(${product.imageUrls[0]})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        borderRadius: '8px',
                        width: '100%',
                        height: '300px'
                      }}
                    />
                    <h3>{product.name}</h3>
                    <div className="product-card-content">
                      <span className="descricao-link">
                        Descrição
                      </span>
                      <span className="price">
                        R$ {Number(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      <button
                        className="add-cart-btn"
                        onClick={e => {
                          e.stopPropagation();
                          handleAdd(product);
                        }}
                      >
                        Adicionar ao Carrinho
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {window.innerWidth > 768 && (
              <button className="carousel-button next" onClick={nextSlide}>
                &#10095;
              </button>
            )}
          </div>

          <div className="carousel-dots">
            {Array.from({ length: Math.ceil(featuredProducts.length / itemsPerView) }).map((_, index) => (
              <button 
                key={index} 
                className={`dot ${Math.floor(startIndex / itemsPerView) === index ? 'active' : ''}`}
                onClick={() => setStartIndex(index * itemsPerView)}
              ></button>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="benefits">
          <h2>Por que escolher arte em origami?</h2>
          <div className="benefits-container">
            <div className="benefit-item">
              <div className="benefit-icon">🎎</div>
              <h3>Significado Cultural</h3>
              <p>Cada peça carrega tradições e simbolismos orientais</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">🌿</div>
              <h3>Sustentabilidade</h3>
              <p>Utilizamos materiais ecológicos e de baixo impacto ambiental</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">❤️</div>
              <h3>Feito à Mão</h3>
              <p>Peças únicas com atenção aos mínimos detalhes</p>
            </div>
          </div>
        </section>

        {/* Testimonials + Recados dos visitantes */}
        <section className="testimonials">
          <h2>O que nossos clientes dizem</h2>
          <div className="testimonial-container">
            {/* Carrossel de recados */}
            {visibleRecados.map((recado) => (
              <div className="testimonial-card" key={recado.id}>
                <p className="recado-msg">
                  "{recado.message.length > 120 ? recado.message.slice(0, 120) + '...' : recado.message}"
                </p>
                <p className="recado-nome">- {recado.name}</p>
              </div>
            ))}
          </div>
          {/* Dots do carrossel */}
          {recados.length > 5 && (
            <div className="recado-carousel-dots">
              {Array.from({ length: recados.length - 4 }).map((_, i) => (
                <button
                  key={i}
                  className={`dot ${recadoStartIndex === i ? 'active' : ''}`}
                  onClick={() => setRecadoStartIndex(i)}
                ></button>
              ))}
            </div>
          )}
        </section>

        {/* Newsletter */}
        <section className="newsletter">
          <h2>Receba nossas novidades</h2>
          <p>Inscreva-se para conhecer novos modelos e promoções</p>
          <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
            <input
              type="email"
              placeholder="Seu e-mail"
              value={newsletterEmail}
              onChange={e => setNewsletterEmail(e.target.value)}
              required
            />
            <button type="submit">Inscrever</button>
          </form>
          {newsletterMsg && <div>{newsletterMsg}</div>}
        </section>

        {expandedProduct && (
          <div className="modal-overlay" onClick={() => {
            setExpandedProduct(null);
            setCarouselPaused(false);
            setModalImageIndex(0); // reset ao fechar
          }}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
              <div
                className="product-image-container"
                style={{
                  backgroundImage: `url(${expandedProduct.imageUrls[modalImageIndex]})`,
                  backgroundSize: 'contain',           // <-- mostra a imagem inteira
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  borderRadius: '8px',
                  width: '100%',
                  height: '380px',
                  marginBottom: '1rem',
                  backgroundColor: 'var(--bege-logo)'  // garante fundo bege
                }}
              >
                {expandedProduct.imageUrls.length > 1 && (
                  <>
                    <button
                      className="modal-arrow left"
                      onClick={e => {
                        e.stopPropagation();
                        setModalImageIndex(idx =>
                          idx === 0 ? expandedProduct.imageUrls.length - 1 : idx - 1
                        );
                      }}
                    >
                      &#10094;
                    </button>
                    <button
                      className="modal-arrow right"
                      onClick={e => {
                        e.stopPropagation();
                        setModalImageIndex(idx =>
                          idx === expandedProduct.imageUrls.length - 1 ? 0 : idx + 1
                        );
                      }}
                    >
                      &#10095;
                    </button>
                  </>
                )}
              </div>
              <h3>{expandedProduct.name}</h3>
              <p>{expandedProduct.description}</p>
              <span
                className="measure"
                style={{ alignSelf: 'flex-start' }}
              >
                {expandedProduct.measure}
              </span>
              <span className="price">
                R$ {Number(expandedProduct.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
              <button className="add-cart-btn" onClick={() => handleAdd(expandedProduct)}>
                Adicionar ao Carrinho
              </button>
              <button className="close-btn" onClick={() => {
                setExpandedProduct(null);
                setCarouselPaused(false);
                setModalImageIndex(0);
              }}>
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
      {addedMsg && (
        <div className="cart-feedback">
          Produto adicionado!
        </div>
      )}
    </>
  );
}

export default Home;