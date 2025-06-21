import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/profile.css';
import type { User,  AuthMode } from '../types/types';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>('none');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: ''
  });

  // Проверка авторизации при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const response = await fetch('/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUser({ ...data.user, cart: [] });
          // Загрузим корзину
          const cartRes = await fetch('/api/cart', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (cartRes.ok) {
            const cartData = await cartRes.json();
            setUser(u => u ? { ...u, cart: cartData.cart } : u);
          }
        }
      } catch (error) {
        console.error('Ошибка проверки авторизации:', error);
      }
    };

    checkAuth();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });

      const data = await response.json();
      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        setAuthMode('none');
        window.location.reload();
      } else {
        alert(data.message || 'Ошибка входа. Проверьте данные.');
      }
    } catch (error) {
      console.error('Ошибка входа:', error);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        alert('Регистрация успешна! Теперь войдите.');
        setAuthMode('login');
      } else {
        alert(data.message || 'Ошибка регистрации. Возможно, пользователь уже существует.');
      }
    } catch (error) {
      console.error('Ошибка регистрации:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.reload();
  };



const [avatarFile, setAvatarFile] = useState<File | null>(null);

const handleAvatarUpload = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!avatarFile) return;
  const reader = new FileReader();
  reader.onloadend = async () => {
    const base64 = reader.result;
    const token = localStorage.getItem('token');
    await fetch('/api/profile/avatar-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ avatar_url: base64 })
    });
    window.location.reload();
  };
  reader.readAsDataURL(avatarFile);
};

  return (
    <div className="profile-page">
      <main className="profile-main">
        {user ? (
          <section className="profile-section">
            <div className="profile-avatar-block" style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24 }}>
              <img
                src={user.avatar_url || "/assets/images/default-avatar.png"}
                alt="Аватар"
                className="profile-avatar"
                style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", marginBottom: 12 }}
              />
              <form
                onSubmit={handleAvatarUpload}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setAvatarFile(e.target.files?.[0] || null)}
                  style={{ marginBottom: 4 }}
                />
                <button type="submit" className="submit-btn" style={{ padding: "6px 16px" }}>
                  Загрузить фото
                </button>
              </form>
            </div>
            <h2>Добро пожаловать, <span className="username">{user.username}</span></h2>
            <p>Email: <span className="email">{user.email}</span></p>
            
            <h3>Ваша корзина:</h3>
            {user.cart && user.cart.length > 0 ? (
              <ul className="cart-items">
                {user.cart.map(item => (
                  <li key={item.id} className="cart-item" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: 32, height: 32, objectFit: "cover", borderRadius: 4 }}
                      />
                    )}
                    {item.name} — {item.quantity} шт. × {item.price} руб.
                  </li>
                ))}
              </ul>
            ) : (
              <p>Ваша корзина пуста</p>
            )}
            
            <button 
              className="logout-btn"
              onClick={handleLogout}
            >
              Выйти
            </button>
          </section>
        ) : (
          <section className="auth-section">
            <h2>Авторизация / Регистрация</h2>
            
            {authMode === 'none' ? (
              <div className="auth-options">
                <button 
                  className="register-btn"
                  onClick={() => setAuthMode('register')}
                >
                  Регистрация
                </button>
                <button 
                  className="login-btn"
                  onClick={() => setAuthMode('login')}
                >
                  Вход
                </button>
              </div>
            ) : null}

            {authMode === 'register' && (
              <div className="register-form auth-form">
                <h3>Регистрация</h3>
                <form onSubmit={handleRegister}>
                  <div className="form-group">
                    <label htmlFor="reg-username">Имя пользователя:</label>
                    <input
                      type="text"
                      id="reg-username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="reg-password">Пароль:</label>
                    <input
                      type="password"
                      id="reg-password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="reg-email">Email:</label>
                    <input
                      type="email"
                      id="reg-email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <button type="submit" className="submit-btn">
                    Регистрация
                  </button>
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => setAuthMode('none')}
                  >
                    Отмена
                  </button>
                </form>
              </div>
            )}

            {authMode === 'login' && (
              <div className="login-form auth-form">
                <h3>Вход</h3>
                <form onSubmit={handleLogin}>
                  <div className="form-group">
                    <label htmlFor="login-username">Имя пользователя:</label>
                    <input
                      type="text"
                      id="login-username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="login-password">Пароль:</label>
                    <input
                      type="password"
                      id="login-password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <button type="submit" className="submit-btn">
                    Войти
                  </button>
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => setAuthMode('none')}
                  >
                    Отмена
                  </button>
                </form>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;