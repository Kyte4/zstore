import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/contact.css';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Форма отправлена:', formData);
    setSubmitted(true);
    setFormData({ name: '', message: '' });
    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="contact-page">
      <header className="contact-header">
        <h1>Контакты</h1>
      </header>

      <main className="contact-main">
        <div className="contact-info">
          <p>
            <strong>Адрес:</strong> Античная 2
          </p>
          <p>
            <strong>Телефон:</strong> нет
          </p>
          <p>
            <strong>Email:</strong> dacik1231@mail.ru
          </p>
        </div>

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Имя:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Введите ваше имя"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Сообщение:</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Ваше сообщение"
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            Отправить
          </button>

          {submitted && (
            <div className="success-message">Сообщение отправлено! Спасибо за обратную связь.</div>
          )}
        </form>
      </main>
    </div>
  );
};

export default ContactPage;
