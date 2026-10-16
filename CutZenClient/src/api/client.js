const API_BASE = '/api';

// 🔴 DETECTAR TIMEZONE DEL NAVEGADOR
const getClientTimeZone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return null;
  }
};

async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem('jwt_token');

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);

  if (!response.ok) {
    // Intentar leer el mensaje de error como JSON o texto
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } else {
        const text = await response.text();
        if (text) errorMessage = text;
      }
    } catch {
      // Si falla leer el body, usar el status
    }
    throw new Error(errorMessage);
  }

  // Si no hay body (204 No Content), no hacer .json()
  if (response.status === 204) {
    return null;
  }

  // Verificar si hay contenido antes de hacer .json()
  const contentLength = response.headers.get('content-length');
  if (contentLength === '0') {
    return null;
  }

  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return null;
  }

  return response.json();
}

export const api = {
  // Client endpoints
  getBarbers: () => fetchWithAuth('/client/barbers'),
  getServices: () => fetchWithAuth('/client/services'),

  // 🔴 ENVÍA EL TIMEZONE DEL CLIENTE AL BACKEND
  getAvailableSlots: (barberId, date) => {
    const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
    const timeZone = getClientTimeZone();
    const tzParam = timeZone ? `&timeZone=${encodeURIComponent(timeZone)}` : '';
    return fetchWithAuth(`/client/available-slots?barberId=${barberId}&date=${dateStr}${tzParam}`);
  },

  getAppointments: () => fetchWithAuth('/client/appointments'),
  createAppointment: (data) => fetchWithAuth('/client/appointments', { method: 'POST', body: JSON.stringify(data) }),
  getProfile: () => fetchWithAuth('/client/profile'),
  getStudioInfo: () => fetchWithAuth('/client/info'),

  // Barber endpoints
  getBarberStats: () => fetchWithAuth('/barber/stats'),
  getBarberAppointments: () => fetchWithAuth('/barber/appointments'),
  updateAppointmentStatus: (id, status, payment) => fetchWithAuth(`/barber/appointments/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status, payment })
  }),

  // Admin schedule endpoints
  getBarberSchedule: (barberId) => fetchWithAuth(`/admin/barbers/${barberId}/schedule`),
  updateBarberSchedule: (barberId, schedule) => fetchWithAuth(`/admin/barbers/${barberId}/schedule`, {
    method: 'PUT',
    body: JSON.stringify(schedule)
  }),

  // Admin endpoints
  getUsers: (role, search, page = 1, pageSize = 10) => 
    fetchWithAuth(`/admin/users?role=${role || ''}&search=${search || ''}&page=${page}&pageSize=${pageSize}`),
  
  // 🔴 FIX: updateUser ahora envía role como STRING
  updateUser: (userId, data) => fetchWithAuth(`/admin/users/${userId}`, { 
    method: 'PUT', 
    body: JSON.stringify({
      ...data,
      role: typeof data.role === 'number' ? String(data.role) : data.role
    }) 
  }),
  
  createBarber: (data) => fetchWithAuth('/admin/barbers', { method: 'POST', body: JSON.stringify(data) }),
  deleteBarber: (barberId) => fetchWithAuth(`/admin/barbers/${barberId}`, { method: 'DELETE' }),
  getAdminAppointments: (search, page = 1, pageSize = 10) => 
    fetchWithAuth(`/admin/appointments?search=${search || ''}&page=${page}&pageSize=${pageSize}`),

  // Admin service endpoints
  getAdminServices: (page = 1, pageSize = 100) => 
    fetchWithAuth(`/admin/services?page=${page}&pageSize=${pageSize}`),
  createService: (data) => fetchWithAuth('/admin/services/json', { 
    method: 'POST', 
    body: JSON.stringify(data) 
  }),
  updateService: (serviceId, data) => fetchWithAuth(`/admin/services/${serviceId}`, { 
    method: 'PUT', 
    body: JSON.stringify(data) 
  }),
  deleteService: (serviceId) => fetchWithAuth(`/admin/services/${serviceId}`, { 
    method: 'DELETE' 
  }),
};
