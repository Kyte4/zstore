document.addEventListener('DOMContentLoaded', () => {
    updateCart();
    setupNotification();
});

function addToCart(productName, productPrice) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let itemIndex = cart.findIndex(item => item.name === productName);

    if (itemIndex > -1) {
        cart[itemIndex].quantity += 1;
    } else {
        cart.push({ name: productName, price: productPrice, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    showNotification(`${productName} добавлен в корзину!`);
    updateCart();
    updateCartSummary(); // Обновляем общую информацию о корзине после добавления товара
}

function updateCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartDiv = document.getElementById('cart');
    if (cartDiv) {
        cartDiv.innerHTML = '<h3>Содержимое корзины:</h3>';
        if (cart.length === 0) {
            cartDiv.innerHTML += '<p>Корзина пуста.</p>';
        } else {
            let total = 0;
            cart.forEach(item => {
                cartDiv.innerHTML += `<p>${item.name} - ${item.price} руб. (x${item.quantity})</p>`;
                total += item.price * item.quantity;
            });
            cartDiv.innerHTML += `<p>Итого: ${total} руб.</p>`;
            cartDiv.innerHTML += '<button onclick="clearCart()">Очистить корзину</button>';
        }
    }
}

function updateCartSummary() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartSummaryDiv = document.getElementById('cart-summary');
    if (cartSummaryDiv) {
        let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        let totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        cartSummaryDiv.innerHTML = `<p>Всего товаров: ${totalItems}</p>`;
        cartSummaryDiv.innerHTML += `<p>Общая сумма: ${totalPrice} руб.</p>`;
    }
}

function clearCart() {
    localStorage.removeItem('cart');
    updateCart();
    updateCartSummary(); // Обновляем общую информацию о корзине после очистки
}

function setupNotification() {
    const modal = document.getElementById("notification");
    const span = document.getElementsByClassName("close")[0];

    span.onclick = function() {
        modal.style.display = "none";
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

    notificationMessage.innerText = message;
    modal.style.display = "block";

    setTimeout(() => {
        modal.style.display = "none";
    }, 2000);
}
