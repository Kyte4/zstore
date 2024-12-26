document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        fetch('/api/profile', {
            headers: {
                'Authorization': token
            }
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('username').textContent = data.username;
            document.getElementById('email').textContent = data.email;
            const cartItems = document.getElementById('cart-items');
            cartItems.innerHTML = '';
            data.cart.forEach(item => {
                const li = document.createElement('li');
                li.textContent = `${item.name} - ${item.quantity}`;
                cartItems.appendChild(li);
            });
        })
        .catch(error => console.error('Ошибка:', error));
    } else {
        window.location.href = 'login.html'; // Перенаправление на страницу входа, если нет токена
    }

    // Обработчик кнопки выхода
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('token');
        alert('Вы вышли из профиля');
        window.location.href = 'index.html';
    });
});