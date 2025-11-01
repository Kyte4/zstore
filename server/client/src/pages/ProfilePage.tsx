import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types/types';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Проверка авторизации при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const response = await fetch('/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUser({ ...data.user, cart: [] });
          // Загрузим корзину
          const cartRes = await fetch('/api/cart', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (cartRes.ok) {
            const cartData = await cartRes.json();
            setUser((u) => (u ? { ...u, cart: cartData.cart } : u));
          }
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Ошибка проверки авторизации:', error);
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ avatar_url: base64 }),
      });
      window.location.reload();
    };
    reader.readAsDataURL(avatarFile);
  };

  return (
    <div>
      <main>
        {user && (
          <section>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: 24,
              }}
            >
              <img
                src={user.avatar_url || '/assets/images/default-avatar.png'}
                alt="Аватар"
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginBottom: 12,
                }}
              />
              <form
                onSubmit={handleAvatarUpload}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                  style={{ marginBottom: 4 }}
                />
                <button type="submit" style={{ padding: '6px 16px' }}>
                  Загрузить фото
                </button>
              </form>
            </div>
            <h2>
              Добро пожаловать, <span>{user.username}</span>
            </h2>
            <p>
              Email: <span>{user.email}</span>
            </p>

            <h3>Ваша корзина:</h3>
            {user.cart && Array.isArray(user.cart) && user.cart.length > 0 ? (
              <ul>
                {user.cart.map((item) => (
                  <li key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name || 'Товар'}
                        style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 4 }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}
                    {item.name || 'Без названия'} — {item.quantity || 1} шт. × {item.price || 0} руб.
                  </li>
                ))}
              </ul>
            ) : (
              <p>Ваша корзина пуста</p>
            )}

            <button onClick={handleLogout}>Выйти</button>
          </section>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;
