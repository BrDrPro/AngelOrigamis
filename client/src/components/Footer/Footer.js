import React from 'react';
import './Footer.css';
import './FooterResponsive.css';
import { FaWhatsapp, FaInstagram, FaFacebook, FaPinterest, FaEnvelope } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-columns">
          
          <div className="footer-column">
            <h3>Contato</h3>
            <address>
              <p>
                <a
                  href="mailto:amgoulart@hotmail.com"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  <FaEnvelope /> Mail
                </a>
              </p>
              <p>
                <a
                  href="https://wa.me/5531971842477"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  <FaWhatsapp /> Whatsapp
                </a>
              </p>
            </address>
          </div>
          
          <div className="footer-column">
            <h3>Redes sociais</h3>
            <div className="social-links">
              <a href="https://www.instagram.com/angelagoularts?igsh=MW5uemVuNHZ4NzNkNQ==" target="_blank" rel="noopener noreferrer">
                <FaInstagram /> Instagram
              </a>
              <a href="https://www.facebook.com/share/17RmoTy3G8/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">
                <FaFacebook /> Facebook
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer">
                <FaPinterest /> Pinterest
              </a>
            </div>
          </div>

          <div className="footer-column">
            <h3>Horário de Funcionamento</h3>
            <p>Seg a Sex: 9h - 18h</p>
            <p>Sábado: 10h - 14h</p>
            <p>Domingo: Fechado</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="copyright">
            &copy; {new Date().getFullYear()} Angel Origamis & Artesanatos
          </p>
          <div className="footer-bottom-links">
            <a href="/privacy">Privacidade</a>
            <a href="/terms">Termos</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;