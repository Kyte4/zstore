document.addEventListener('DOMContentLoaded', () => {
    const profileSection = document.getElementById('profile-section');
    const authSection = document.getElementById('auth-section');
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const authOptions = document.getElementById('auth-options');
    const cartItems = document.getElementById('cart-items');
    
    // Проверка токена
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
            authSection.style.display = 'none';
            profileSection.style.display = 'block';
        })
        .catch(error => console.error('Ошибка:', error));
    } else {
        authSection.style.display = 'block';
        profileSection.style.display = 'none';
    }

    // Показ формы регистрации
    document.getElementById('register-btn').addEventListener('click', () => {
        authOptions.style.display = 'none';
        registerForm.style.display = 'block';
        loginForm.style.display = 'none';
    });

    // Показ формы входа
    document.getElementById('login-btn').addEventListener('click', () => {
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
            authSection.style.display = 'none';
            profileSection.style.display = 'block';
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
                window.location.reload();
            } else {
                alert('Ошибка входа');
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    });

    // Обработчик кнопки выхода
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('token');
        alert('Вы вышли из профиля');
        window.location.reload();
    });
});
