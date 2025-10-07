import React from 'react';
import '../styles/footer.css';

const Footer: React.FC = () => (
  <footer className="footer">
  <div className="footer-main">
    <div className="footer-col left">
      <h2>СТОР</h2>
      <p>Лучший маркетплейс товаров. Быстрая доставка, поддержка 24/7, гарантия качества.</p>
    </div>
    <div className="footer-col center">
      <div className="footer-socials">
        <a href="https://vk.com" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-vk"></i></a>
        <a href="https://t.me/kyte4" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-telegram"></i></a>
      </div>
      <img src="/assets/images/QR.png" alt="QR Telegram" className="footer-qr" />
    </div>
    <div className="footer-col right">
      <ul>
        <li><a href="/catalog">Магазин</a></li>
        <li><a href="/profile">Личный кабинет</a></li>
        <li><a href="">Помощь</a></li>
        <li><a href="/contact">Контакты</a></li>
        <li><a href="http://localhost:5000/api/docs"  target="_blank" rel="noopener noreferrer" >Документация API</a></li>
      </ul>
    </div>
  </div>
  <div className="footer-bottom">
    © 2025 СТОР. Все права защищены.
  </div>
</footer>
);

export default Footer;