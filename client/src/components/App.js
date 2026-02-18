import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './CartContext/CartContext';
import '../styles/App.css';
import '../styles/global.css';
import Header from './Header/Header';
import Home from './Pages/Home/Home';
import About from './Pages/About/About';
import Services from './Pages/Services/Services';
import Contact from './Pages/Contact/Contact';
import Cart from './Pages/Cart/Cart';
import Footer from './Footer/Footer';
import AdmLogin from './Pages/AdmLogin/AdmLogin';
import Dashboard from './Pages/Dashboard/Dashboard';

function Layout() {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');

    return (
        <div className="App">
            {!isAdminRoute && <Header />}
            <main className="App-main">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/admin/login" element={<AdmLogin />} />
                    <Route path="/admin/dashboard" element={<Dashboard />} />
                </Routes>
            </main>
            {!isAdminRoute && <Footer />}
        </div>
    );
}

function App() {
    return (
        <CartProvider>
            <Router>
                <Layout />
            </Router>
        </CartProvider>
    );
}

export default App;