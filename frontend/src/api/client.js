const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }))
    throw new Error(error.detail || 'Request failed')
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export const api = {
  login: (payload) => request('/auth/login/', { method: 'POST', body: JSON.stringify(payload) }),
  signup: (payload) => request('/auth/signup/', { method: 'POST', body: JSON.stringify(payload) }),
  logout: () => request('/auth/logout/', { method: 'POST' }),
  profile: {
    get: () => request('/auth/profile/', { method: 'GET' }),
    update: (payload) => request('/auth/profile/', { method: 'PUT', body: JSON.stringify(payload) }),
  },
  trips: {
    list: () => request('/trips/', { method: 'GET' }),
    get: (tripId) => request(`/trips/${tripId}/`, { method: 'GET' }),
    create: (payload) => request('/trips/', { method: 'POST', body: JSON.stringify(payload) }),
  },
}

export default request
