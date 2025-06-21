// src/pages/HomePage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css'; 
import '../styles/footer.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">

      <main className="main-content">
        <section className="hero">
          <div className="hero-text">
            <h2>Добро пожаловать в ZSTORE</h2>
            <p>Лучшие товары по самым выгодным ценам</p>
            <button 
              className="cta-button" 
              onClick={() => navigate('/catalog')}
            >
              Перейти в каталог
            </button>
          </div>
          <div className="hero-image">
            <img 
              src="/assets/images/daciksmall.png" 
              alt="Чиловый Дацик" 
              className="featured-product" 
            />
          </div>
        </section>

        <section className="features">
          <div className="feature-card">
            <h3>Быстрая доставка</h3>
            <p>Доставим ваш заказ в течение 24 часов</p>
          </div>
          <div className="feature-card">
            <h3>Гарантия качества</h3>
            <p>Все товары проходят строгий контроль</p>
          </div>
          <div className="feature-card">
            <h3>Поддержка 24/7</h3>
            <p>Наши операторы всегда на связи</p>
          </div>
        </section>
      </main>

    </div>
  );
};

export default HomePage;