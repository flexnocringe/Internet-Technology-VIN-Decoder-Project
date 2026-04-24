import api from './api.js';

const token = localStorage.getItem('token');
if (!token) {
    window.location.href = 'index.html';
}

const vinForm = document.getElementById('vinForm');
const vinInput = document.getElementById('vinInput');
const decodeBtn = document.getElementById('decodeBtn');
const messageEl = document.getElementById('message');
const reportSection = document.getElementById('reportSection');
const reportGrid = document.getElementById('reportGrid');

function setMessage(text, type = 'error') {
    messageEl.textContent = text;
    messageEl.className = `message show ${type}`;
}

function clearMessage() {
    messageEl.textContent = '';
    messageEl.className = 'message';
}

function hideReport() {
    reportSection.classList.add('hidden');
    reportGrid.innerHTML = '';
}

function formatValue(value) {
    if (value === null || value === undefined || value === '') {
        return '—';
    }

    if (typeof value === 'object') {
        return JSON.stringify(value, null, 2);
    }

    return String(value);
}

function createCard(label, value, highlight = false) {
    const card = document.createElement('article');
    card.className = `report-card${highlight ? ' report-card-highlight' : ''}`;

    const title = document.createElement('h3');
    title.textContent = label;

    const content = document.createElement('p');
    content.textContent = formatValue(value);

    card.append(title, content);
    return card;
}

function renderReport(data, vin) {
    const normalized = data || {};
    const cards = [
        createCard('VIN', normalized.vin || vin, true),
        createCard('Origin', normalized.origin),
        createCard('Type', normalized.type),
        createCard('Make', normalized.make),
        createCard('Model', normalized.model),
        createCard('Manufacturer', normalized.manufacturer),
    ];

    reportGrid.replaceChildren(...cards);
    reportSection.classList.remove('hidden');
}

vinForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const vin = vinInput.value.trim().toUpperCase();

    if (!vin) {
        setMessage('Enter a VIN to decode.', 'error');
        hideReport();
        return;
    }

    clearMessage();
    decodeBtn.disabled = true;
    decodeBtn.textContent = 'Decoding...';

    try {
        const result = await api.vin.decodeVin(vin);
        setMessage('VIN decoded successfully.', 'success');
        renderReport(result, vin);
    } catch (error) {
        setMessage(error?.message || 'VIN decoding failed.', 'error');
        hideReport();
    } finally {
        decodeBtn.disabled = false;
        decodeBtn.textContent = 'Decode VIN';
    }
});

vinInput.focus();