import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './CartContext/CartContext';
import { StoreSettingsProvider } from './StoreSettingsContext/StoreSettingsContext';
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
import DashboardHome from './Pages/Dashboard/DashboardHome/DashboardHome';
import DashboardProducts from './Pages/Dashboard/DashboardProducts/DashboardProducts';
import DashboardOrders from './Pages/Dashboard/DashboardOrders/DashboardOrders';
import DashboardMessages from './Pages/Dashboard/DashboardMessages/DashboardMessages';
import DashboardSettings from './Pages/Dashboard/DashboardSettings/DashboardSettings';

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
                    <Route path="/admin/dashboard" element={<Dashboard />}>
                        <Route index element={<DashboardHome />} />
                        <Route path="produtos" element={<DashboardProducts />} />
                        <Route path="pedidos" element={<DashboardOrders />} />
                        <Route path="mensagens" element={<DashboardMessages />} />
                        <Route path="configuracoes" element={<DashboardSettings />} />
                    </Route>
                </Routes>
            </main>
            {!isAdminRoute && <Footer />}
        </div>
    );
}

function App() {
    return (
        <StoreSettingsProvider>
            <CartProvider>
                <Router>
                    <Layout />
                </Router>
            </CartProvider>
        </StoreSettingsProvider>
    );
}

export default App;