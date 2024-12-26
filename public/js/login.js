document.addEventListener('DOMContentLoaded', () => {
    const profileBtn = document.getElementById('profile-btn');
    const profileModal = document.getElementById('profile-modal');
    const closeBtn = document.querySelector('.close-btn');
    const registerBtn = document.getElementById('register-btn');
    const loginBtn = document.getElementById('login-btn');
    const authOptions = document.getElementById('auth-options');
    const profileInfo = document.getElementById('profile-info');
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const cartItems = document.getElementById('cart-items');
    const logoutBtn = document.getElementById('logout-btn');

    // Открываем модальное окно профиля при нажатии на кнопку "Профиль"
    profileBtn.addEventListener('click', () => {
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
                cartItems.innerHTML = '';
                data.cart.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = `${item.name} - ${item.quantity}`;
                    cartItems.appendChild(li);
                });
                authOptions.style.display = 'none';
                profileInfo.style.display = 'block';
            })
            .catch(error => console.error('Ошибка:', error));
        } else {
            authOptions.style.display = 'block';
            profileInfo.style.display = 'none';
        }
        profileModal.style.display = 'block';
        registerForm.style.display = 'none';
        loginForm.style.display = 'none';
    });

    // Закрываем модальное окно при нажатии на кнопку закрытия
    closeBtn.addEventListener('click', () => {
        profileModal.style.display = 'none';
    });

    // Закрываем модальное окно при клике вне его
    window.addEventListener('click', (event) => {
        if (event.target == profileModal) {
            profileModal.style.display = 'none';
        }
    });

    // Показ формы регистрации при нажатии на кнопку "Регистрация"
    registerBtn.addEventListener('click', () => {
        authOptions.style.display = 'none';
        registerForm.style.display = 'block';
        loginForm.style.display = 'none';
    });

    // Показ формы входа при нажатии на кнопку "Вход"
    loginBtn.addEventListener('click', () => {
        authOptions.style.display = 'none';
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
    });

    // Обработчик формы регистрации
    document.getElementById('register').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            username: formData.get('username'),
            password: formData.get('password'),
            email: formData.get('email')
        };

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            alert(result.message || 'Регистрация успешна');
            profileModal.style.display = 'none';
        } catch (error) {
            console.error('Ошибка:', error);
        }
    });

    // Обработчик формы входа
    document.getElementById('login').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            username: formData.get('username'),
            password: formData.get('password')
        };

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (result.auth) {
                localStorage.setItem('token', result.token);
                alert('Успешный вход');
                profileModal.style.display = 'none';
            } else {
                alert('Ошибка входа');
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    });

    // Обработчик кнопки выхода
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        alert('Вы вышли из профиля');
        profileModal.style.display = 'none';
    });
});
