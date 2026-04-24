import api from './api.js';

const showRegisterBtn = document.getElementById('showRegister');
const showLoginBtn = document.getElementById('showLogin');
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const messageEl = document.getElementById('message');

function setMessage(text, type) {
    messageEl.textContent = text;
    messageEl.className = `message show ${type}`;
}

function clearMessage() {
    messageEl.textContent = '';
    messageEl.className = 'message';
}

function showForm(which) {
    clearMessage();
    const isRegister = which === 'register';
    registerForm.classList.toggle('active', isRegister);
    loginForm.classList.toggle('active', !isRegister);
    showRegisterBtn.classList.toggle('active', isRegister);
    showLoginBtn.classList.toggle('active', !isRegister);
}

showRegisterBtn.addEventListener('click', () => showForm('register'));
showLoginBtn.addEventListener('click', () => showForm('login'));

registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;

    if (!email || !password) {
        setMessage('Please enter both email and password.', 'error');
        return;
    }

    try {
        const result = await api.auth.register(email, password);
        setMessage(result?.message || 'Registration successful.', 'success');
        registerForm.reset();
    } catch (error) {
        setMessage(error?.message || 'Register request failed.', 'error');
    }
});

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        setMessage('Please enter both email and password.', 'error');
        return;
    }

    try {
        const result = await api.auth.login(email, password);
        setMessage(result?.message || 'Login successful.', 'success');
        window.location.href = 'decoder.html';
    } catch (error) {
        setMessage(error?.message || 'Login request failed.', 'error');
    }
});

showForm('login');