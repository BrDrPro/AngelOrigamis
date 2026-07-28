import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import './HeaderResponsive.css';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminLoggedIn = Boolean(localStorage.getItem('adminToken'));

  function handleEncomendar() {
    if (location.pathname === '/contact') {
      navigate('/contact?form=encomenda', { replace: true });
      window.scrollTo(0, 0);
    } else {
      navigate('/contact?form=encomenda');
      window.scrollTo(0, 0);
    }
  }

  function handleNav(path) {
    if (location.pathname !== path) {
      navigate(path);
    }
    window.scrollTo(0, 0);
  }

  return (
    <header className="site-header">
      <div className="header-container">
        <div className="logo">
          <button
            className="logo-link"
            onClick={() => handleNav('/')}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            <img src={"/assets/logo png.png"} alt="Origami & Arte Logo" className="site-logo" />
          </button>
        </div>
        <nav className="main-nav">
          <ul>
            <li><button onClick={() => handleNav('/')} className="nav-btn">Início</button></li>
            <li><button onClick={() => handleNav('/about')} className="nav-btn">Sobre</button></li>
            <li><button onClick={() => handleNav('/services')} className="nav-btn">Produtos</button></li>
            <li><button onClick={() => handleNav('/contact')} className="nav-btn">Contato</button></li>
            <li><button onClick={() => handleNav('/cart')} className="nav-btn">Carrinho</button></li>
          </ul>
        </nav>
        <div className="header-actions">
          <button
            className="login-btn"
            onClick={() => handleNav(isAdminLoggedIn ? '/admin/dashboard' : '/admin/login')}
          >
            {isAdminLoggedIn ? 'Dashboard' : 'Login'}
          </button>
          <button className="encomendar-btn" onClick={handleEncomendar}>Encomendar</button>
        </div>
      </div>
    </header>
  );
}

export default Header;