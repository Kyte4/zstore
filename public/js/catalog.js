document.addEventListener('DOMContentLoaded', () => {
    const imageMap = {
        'БАНАН': 'banan.png',
        'ЯБЛОКО': 'apple.png',
        'ПЕРЕЦ': 'per4ik.png',
        'ЧИЛОВЫЙ ДАЦИК': 'dacik.png'
    };

    fetch('/api/products')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (!Array.isArray(data)) {
                throw new TypeError('Expected an array but got a different type');
            }
            const productList = document.getElementById('product-list');
            productList.innerHTML = ''; // Очистка контейнера перед добавлением продуктов

            data.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('product');

                // Используем маппинг для получения правильного имени файла изображения
                const imageName = imageMap[product.name] || 'default.png'; // 'default.png' для неизвестных товаров

                productDiv.innerHTML = `
                    <h2>${product.name}</h2>
                    <img src="fotostyles/${imageName}" alt="${product.name}">
                    <p>Цена: ${product.price} руб.</p>
                    <a href="product.html?id=${product.id}">Подробнее</a>
                `;
                productList.appendChild(productDiv);
            });
        })
        .catch(error => console.error('Ошибка:', error));
});
