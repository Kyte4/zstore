// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CatalogPage from './pages/CatalogPage.tsx';
import ProductPage from './pages/ProductPage.tsx';
import HomePage from './pages/HomePage.tsx';
import ContactPage from './pages/ContactPage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import AboutPage from './pages/AboutPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import './styles/index.css'; // Импортируем стили
import './styles/catalog.css'; // Стили для каталога
import './styles/product.css'; // Стили для страницы товара
import './styles/home.css'; // Стили для главной страницы 
import './styles/contact.css'; // Стили для страницы контактов
import './styles/profile.css'; // Стили для страницы профиля
import './styles/about.css'; // Стили для страницы "О нас"
import './styles/login.css'; // Стили для страницы входа
import './styles/header.css'; // Стили для шапки сайта

import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;