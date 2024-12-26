document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id'); // Получаем идентификатор продукта из URL

    if (!productId) {
        console.error('Идентификатор продукта не найден в URL');
        return;
    }

    fetch(`/api/product/${productId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка при загрузке данных о продукте');
            }
            return response.json();
        })
        .then(product => {
            const productName = document.getElementById('product-name');
            const productPrice = document.getElementById('product-price');
            const productImage = document.getElementById('product-image');
            const productDescription = document.getElementById('product-description');

            if (productName) productName.textContent = product.name;
            if (productPrice) productPrice.textContent = `${product.price} руб.`;
            if (productImage) productImage.src = `fotostyles/${product.image}`;
            if (productDescription) productDescription.textContent = product.description;

            const addToCartBtn = document.getElementById('add-to-cart-btn');
            if (addToCartBtn) {
                addToCartBtn.addEventListener('click', () => {
                    addToCart(product.id, 1);
                });
            }
        })
        .catch(error => console.error('Ошибка:', error));

    setupNotification();
    updateCartSummary();
});

function addToCart(productId, quantity) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Пожалуйста, войдите в систему, чтобы добавить товары в корзину.');
        window.location.href = 'profile.html';
        return;
    }

    fetch('/api/cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({ productId, quantity })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            showNotification(data.message);
            updateCartSummary();
        } else {
            showNotification('Ошибка при добавлении товара в корзину.');
        }
    })
    .catch(error => console.error('Ошибка:', error));
}

function updateCartSummary() {
    const token = localStorage.getItem('token');
    if (!token) {
        return;
    }

    fetch('/api/cart', {
        method: 'GET',
        headers: {
            'Authorization': token
        }
    })
    .then(response => response.json())
    .then(data => {
        const cartSummaryDiv = document.getElementById('cart-summary');
        if (cartSummaryDiv) {
            let totalItems = data.reduce((sum, item) => sum + item.quantity, 0);
            let totalPrice = data.reduce((sum, item) => sum + item.price * item.quantity, 0);
            cartSummaryDiv.innerHTML = `<p>Всего товаров: ${totalItems}</p>`;
            cartSummaryDiv.innerHTML += `<p>Общая сумма: ${totalPrice} руб.</p>`;
        }
    })
    .catch(error => console.error('Ошибка:', error));
}

function setupNotification() {
    const modal = document.getElementById("notification");
    const span = document.getElementsByClassName("close")[0];

    if (span) {
        span.onclick = function() {
            modal.style.display = "none";
        }
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

function showNotification(message) {
    const modal = document.getElementById("notification");
    const notificationMessage = document.getElementById("notification-message");

    if (notificationMessage) {
        notificationMessage.innerText = message;
        modal.style.display = "block";

        setTimeout(() => {
            modal.style.display = "none";
        }, 2000);
    }
}
