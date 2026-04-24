const API_BASE = '/api';

function getToken() {
    return localStorage.getItem('token');
}

async function request(path, { method = 'GET', data, auth = false } = {}) {
    const headers = { 'Content-Type': 'application/json' };

    if (auth) {
        const token = getToken();
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
    }

    const response = await fetch(`${API_BASE}${path}`, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined
    });

    let body = null;
    try {
        body = await response.json();
    } catch (_) {
        body = null;
    }

    if (!response.ok || body?.success === false) {
        const message = body?.message || 'Request failed';
        throw new Error(message);
    }

    return body;
}

async function register(email, password) {
    return request('/auth/register', {
        method: 'POST',
        data: { email, password }
    });
}

async function login(email, password) {
    const response = await request('/auth/login', {
        method: 'POST',
        data: { email, password }
    });

    if (response?.token) {
        localStorage.setItem('token', response.token);
    }

    return response;
}

export async function decodeVin(vin) {
    return request('/vin/decode', {
        method: 'POST',
        data: { vin },
        auth: true
    });
}

export async function getHistory() {
    return request('/vin/history', { auth: true });
}

export async function deleteHistoryEntry(id) {
    return request(`/vin/history/${id}`, {
        method: 'DELETE',
        auth: true
    });
}

const api = {
    auth: {
        register,
        login
    },
    vin: {
        decodeVin,
        getHistory,
        deleteHistoryEntry
    }
};

export { login, register };
export default api;