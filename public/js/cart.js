document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        fetch('/api/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('username').textContent = data.username;
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
});
