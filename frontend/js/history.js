import api from './api.js';

const token = localStorage.getItem('token');
if (!token) {
    window.location.href = 'index.html';
}

const messageEl = document.getElementById('message');
const historyList = document.getElementById('historyList');
const detailsModal = document.getElementById('detailsModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const detailList = document.getElementById('detailList');
const modalTitle = document.getElementById('modalTitle');

function setMessage(text, type = 'error') {
    if (!messageEl) {
        return;
    }

    messageEl.textContent = text;
    messageEl.className = `message show ${type}`;
}

function clearMessage() {
    if (!messageEl) {
        return;
    }

    messageEl.textContent = '';
    messageEl.className = 'message';
}

function formatValue(value) {
    if (value === null || value === undefined || value === '') {
        return '—';
    }

    return String(value);
}

function closeModal() {
    detailsModal.classList.remove('show');
    detailsModal.setAttribute('aria-hidden', 'true');
    detailList.innerHTML = '';
}

function addDetailRow(label, value) {
    const row = document.createElement('div');
    row.className = 'detail-row';

    const labelEl = document.createElement('span');
    labelEl.className = 'detail-label';
    labelEl.textContent = label;

    const valueEl = document.createElement('span');
    valueEl.textContent = formatValue(value);

    row.append(labelEl, valueEl);
    detailList.appendChild(row);
}

function openModal(entry) {
    const decoded = entry.decodedData || {};
    modalTitle.textContent = `VIN ${entry.vin}`;
    detailList.innerHTML = '';

    addDetailRow('VIN', decoded.vin || entry.vin);
    addDetailRow('Requested At', new Date(entry.createdAt).toLocaleString());
    addDetailRow('Origin', decoded.origin);
    addDetailRow('Type', decoded.type);
    addDetailRow('Make', decoded.make);
    addDetailRow('Model', decoded.model);
    addDetailRow('Manufacturer', decoded.manufacturer);

    detailsModal.classList.add('show');
    detailsModal.setAttribute('aria-hidden', 'false');
}

function renderEntry(entry) {
    const row = document.createElement('div');
    row.className = 'history-item-row';

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'history-item-btn';
    button.addEventListener('click', () => openModal(entry));

    const vinEl = document.createElement('span');
    vinEl.className = 'history-item-vin';
    vinEl.textContent = entry.vin;

    const timeEl = document.createElement('span');
    timeEl.className = 'history-item-time';
    timeEl.textContent = new Date(entry.createdAt).toLocaleString();

    button.append(vinEl, timeEl);

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'delete-btn';
    deleteBtn.setAttribute('aria-label', `Delete ${entry.vin}`);
    deleteBtn.textContent = 'X';
    deleteBtn.addEventListener('click', async (event) => {
        event.stopPropagation();

        try {
            await api.vin.deleteHistoryEntry(entry._id);
            if (detailsModal.classList.contains('show')) {
                closeModal();
            }
            setMessage('Entry deleted.', 'success');
            await loadHistory();
        } catch (error) {
            setMessage(error?.message || 'Failed to delete entry.', 'error');
        }
    });

    row.append(button, deleteBtn);
    return row;
}

async function loadHistory() {
    try {
        const entries = await api.vin.getHistory();

        if (!Array.isArray(entries) || entries.length === 0) {
            setMessage('No VIN history yet.', 'success');
            historyList.innerHTML = '';
            return;
        }

        clearMessage();
        historyList.replaceChildren(...entries.map(renderEntry));
    } catch (error) {
        setMessage(error?.message || 'Failed to load history.', 'error');
    }
}

closeModalBtn.addEventListener('click', closeModal);
detailsModal.addEventListener('click', (event) => {
    if (event.target === detailsModal) {
        closeModal();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && detailsModal.classList.contains('show')) {
        closeModal();
    }
});

loadHistory();