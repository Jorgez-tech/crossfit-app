import axios from 'axios';
import authService from './authService';
import logger from '../utils/logger';

const log = logger.scoped('ApiService');

// Configuración base de la API
const apiClient = axios.create({
    baseURL: process.env.VUE_APP_API_URL || 'http://localhost:3000/api/v1',
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000 // 10 segundos de timeout
});

// Interceptor para agregar token de autenticación
apiClient.interceptors.request.use(
    config => {
        const token = authService.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Interceptor para manejo de errores
apiClient.interceptors.response.use(
    response => response,
    error => {
        log.error('Error en llamada a la API', error);

        if (!error.response) {
            // Error de red o CORS
            console.error('Error de conexión: Posible problema de CORS o servidor caído.');
        }

        // Si es error 401 (no autorizado), cerrar sesión
        if (error.response && error.response.status === 401) {
            authService.logout();
            // Opcional: redirigir al login
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default {
    // Métodos para WODs (Workouts of the Day)
    getWods() {
        return apiClient.get('/workouts');
    },

    getWodById(id) {
        return apiClient.get(`/workouts/${id}`);
    },

    createWod(wodData) {
        return apiClient.post('/workouts', wodData);
    },

    updateWod(id, wodData) {
        return apiClient.patch(`/workouts/${id}`, wodData);
    },

    deleteWod(id) {
        return apiClient.delete(`/workouts/${id}`);
    },

    // Métodos para Members
    getMembers() {
        return apiClient.get('/members');
    },

    getMemberById(id) {
        return apiClient.get(`/members/${id}`);
    },

    createMember(memberData) {
        return apiClient.post('/members', memberData);
    },

    updateMember(id, memberData) {
        return apiClient.patch(`/members/${id}`, memberData);
    },

    deleteMember(id) {
        return apiClient.delete(`/members/${id}`);
    },

    // Métodos para Records
    getRecords() {
        return apiClient.get('/records');
    },

    getRecordById(id) {
        return apiClient.get(`/records/${id}`);
    },

    createRecord(recordData) {
        return apiClient.post('/records', recordData);
    },

    updateRecord(id, recordData) {
        return apiClient.patch(`/records/${id}`, recordData);
    },

    deleteRecord(id) {
        return apiClient.delete(`/records/${id}`);
    },

    // Métodos específicos de WODs
    getWodRecords(wodId) {
        return apiClient.get(`/workouts/${wodId}/records`);
    }
};
