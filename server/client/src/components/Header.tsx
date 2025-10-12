import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/header.css';

const Header = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('/api/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) setUsername(data.user.username);
      });
  }, []);
  return (
    <header className="header">
      <div className="logo-container">
        <h1 style={{ color: '#007bff', marginLeft: 8 }}>СТОР</h1>
      </div>
      <nav className="nav">
        <button className="nav-link" onClick={() => navigate('/')}>
          Главная
        </button>
        <button className="nav-link" onClick={() => navigate('/catalog')}>
          Каталог
        </button>
        <button className="nav-link" onClick={() => navigate('/about')}>
          О нас
        </button>
        <button className="nav-link" onClick={() => navigate('/contact')}>
          Контакты
        </button>
        {username ? (
          <button className="username-display" onClick={() => navigate('/profile')}>
            Привет, {username}!
          </button>
        ) : (
          <button className="login-button" onClick={() => navigate('/login')}>
            Войти
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
