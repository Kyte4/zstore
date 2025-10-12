// src/pages/ProductPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/product.css';
import type { Product, Notification } from '../types/types';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notification>({
    message: '',
    visible: false,
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Товар не найден');
        }

        const data = await response.json();
        setProduct(data);
      } catch (err) {
        console.error('Ошибка загрузки товара:', err);
        setError(err instanceof Error ? err.message : 'Произошла ошибка');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Сначала войдите в аккаунт!');
      return;
    }
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: product.id, quantity: 1 }),
      });
      const data = await response.json();
      if (data.success) {
        alert('Товар добавлен в корзину!');
      } else {
        alert(data.message || 'Ошибка добавления в корзину');
      }
    } catch {
      alert('Ошибка сервера');
    }
  };

  if (loading) {
    return <div className="loading">Загрузка товара...</div>;
  }

  if (error) {
    return <div className="error">Ошибка: {error}</div>;
  }

  if (!product) {
    return <div className="error">Товар не найден</div>;
  }

  return (
    <div className="product-page">
      <header className="product-header">
        <h1>{product.name}</h1>
      </header>

      <main className="product-main">
        <img src={`${product.image}`} alt={product.name} className="product-image" />
        <p className="product-description">{product.description}</p>
        <p className="product-price">Цена: {product.price} руб.</p>
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          Добавить в корзину
        </button>
      </main>

      {/* Модальное окно уведомления */}
      {notification.visible && (
        <div className="modal">
          <div className="modal-content">
            <span
              className="close"
              onClick={() => setNotification({ ...notification, visible: false })}
            >
              &times;
            </span>
            <p>{notification.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
