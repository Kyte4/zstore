import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/catalog.css';
import type { Product } from '../types/types';

const CatalogPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new TypeError('Expected an array but got a different type');
        }

        setProducts(data);
        setError(null);
      } catch (err) {
        console.error('Ошибка:', err);
        setError(err instanceof Error ? err.message : 'Произошла неизвестная ошибка');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (id: number) => {
    navigate(`/product/${id}`);
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (error) {
    return <div className="error">Ошибка: {error}</div>;
  }

  return (
    <div className="catalog">
      <h1 className="catalog-title">Каталог товаров</h1>
      <div id="product-list" className="product-list">
        {products.map((product) => (
          <div key={product.id} className="product">
            <h2>{product.name}</h2>
            <img
              src={product.image ? product.image.replace(/\\/g, '/') : '/assets/images/default-product.png'}
              alt={product.name}
              className="product-image"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/images/default-product.png';
              }}
            />
            <p>Цена: {product.price} руб.</p>
            <button onClick={() => handleProductClick(product.id)} className="details-button">
              Подробнее
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default CatalogPage;
