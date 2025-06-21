import React, { useState } from 'react';
import '../styles/login.css'; // Импортируем стили для страницы входа 

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
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
    } catch {
      setError('Ошибка сервера');
    }
  };

  return (
    <div className="login-page" style={{ maxWidth: 400, margin: "40px auto", padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
      <h2>Вход в аккаунт</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label>Логин</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            style={{ width: "100%", padding: 8, marginTop: 4, borderRadius: 6, border: "1px solid #ccc" }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Пароль</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: 8, marginTop: 4, borderRadius: 6, border: "1px solid #ccc" }}
          />
        </div>
        {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
        <button type="submit" style={{ width: "100%", padding: 10, borderRadius: 6, background: "#007bff", color: "#fff", border: "none", fontWeight: 600 }}>
          Войти
        </button>
      </form>
    </div>
  );
};

export default LoginPage;