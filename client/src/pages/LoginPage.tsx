import React, { useState } from 'react';
import '../styles/login.css'; // Импортируем стили для страницы входа 

const LoginPage: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (mode === 'login') {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        if (data.success && data.token) {
          localStorage.setItem('token', data.token);
          window.location.href = '/profile';
        } else {
          setError(data.message || 'Ошибка входа');
        }
      } else {
        // Регистрация
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password, email }),
        });
        const data = await response.json();
        if (data.success) {
          // После успешной регистрации сразу логиним
          const loginRes = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
          });
          const loginData = await loginRes.json();
          if (loginData.success && loginData.token) {
            localStorage.setItem('token', loginData.token);
            window.location.href = '/profile';
          } else {
            setError('Регистрация прошла, но не удалось войти');
          }
        } else {
          setError(data.message || 'Ошибка регистрации');
        }
      }
    } catch {
      setError('Ошибка сервера');
    }
  };

  return (
    <div className="login-page">
      <h2>{mode === 'login' ? 'Вход в аккаунт' : 'Регистрация'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="login-form-group">
          <label>Логин</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            className="login-input"
          />
        </div>
        {mode === 'register' && (
          <div className="login-form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="login-input"
            />
          </div>
        )}
        <div className="login-form-group">
          <label>Пароль</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="login-input"
          />
        </div>
        {error && <div className="login-error">{error}</div>}
        <button type="submit" className="login-submit-btn">
          {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
        </button>
      </form>
      <div className="login-toggle">
        {mode === 'login' ? (
          <span>
            Нет аккаунта?{' '}
            <button type="button" className="login-toggle-btn" onClick={() => setMode('register')}>
              Зарегистрироваться
            </button>
          </span>
        ) : (
          <span>
            Уже есть аккаунт?{' '}
            <button type="button" className="login-toggle-btn" onClick={() => setMode('login')}>
              Войти
            </button>
          </span>
        )}
      </div>
    </div>
  );
};

export default LoginPage;