const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

// Get CSRF token from cookie
function getCsrfToken() {
  const name = 'csrftoken'
  let cookieValue = null
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';')
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim()
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
        break
      }
    }
  }
  return cookieValue
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  // Add CSRF token if available
  const csrfToken = getCsrfToken()
  if (csrfToken) {
    headers['X-CSRFToken'] = csrfToken
  }

  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers,
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }))
    
    // Build detailed error message
    let errorMessage = error.detail || 'Request failed'
    
    // Handle validation errors (list of field errors)
    if (Array.isArray(error)) {
      errorMessage = error.join(', ')
    } 
    // Handle object with field errors
    else if (typeof error === 'object' && !error.detail) {
      const messages = Object.entries(error)
        .map(([field, msgs]) => {
          const fieldMessages = Array.isArray(msgs) ? msgs.join(', ') : msgs
          return `${field}: ${fieldMessages}`
        })
        .join(' | ')
      if (messages) errorMessage = messages
    }
    
    throw new Error(errorMessage)
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
  stops: {
    addToTrip: (tripId, payload) => request(`/trips/${tripId}/stops/`, { method: 'POST', body: JSON.stringify(payload) }),
    update: (stopId, payload) => request(`/stops/${stopId}/`, { method: 'PUT', body: JSON.stringify(payload) }),
    delete: (stopId) => request(`/stops/${stopId}/`, { method: 'DELETE' }),
  },
  activities: {
    addToStop: (stopId, payload) => request(`/stops/${stopId}/activities/`, { method: 'POST', body: JSON.stringify(payload) }),
    update: (activityId, payload) => request(`/activities/${activityId}/`, { method: 'PUT', body: JSON.stringify(payload) }),
    delete: (activityId) => request(`/activities/${activityId}/`, { method: 'DELETE' }),
  },
  budgets: {
    getForTrip: (tripId) => request(`/trips/${tripId}/budget/`, { method: 'GET' }),
    createForTrip: (tripId, payload) => request(`/trips/${tripId}/budget/`, { method: 'POST', body: JSON.stringify(payload) }),
    update: (budgetId, payload) => request(`/budget/${budgetId}/`, { method: 'PUT', body: JSON.stringify(payload) }),
  },
}

export default request
