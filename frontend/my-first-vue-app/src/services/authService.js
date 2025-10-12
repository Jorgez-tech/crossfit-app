import axios from 'axios';
import logger from '../utils/logger';

const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000/api/v1';
const log = logger.scoped('AuthService');

// Cliente axios específico para autenticación
const authClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000
});

class AuthService {
    constructor() {
        this.token = localStorage.getItem('auth_token');
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
    }

    // Registrar nuevo usuario
    async register(userData) {
        try {
            const response = await authClient.post('/auth/register', userData);
            if (response.data.status === 'OK' && response.data.data.token) {
                this.setAuthData(response.data.data);
            }
            return response.data;
        } catch (error) {
            log.error('Error en registro', error);
            throw error;
        }
    }

    // Iniciar sesión
    async login(credentials) {
        try {
            const response = await authClient.post('/auth/login', credentials);
            if (response.data.status === 'OK' && response.data.data.token) {
                this.setAuthData(response.data.data);
            }
            return response.data;
        } catch (error) {
            log.error('Error en login', error);
            throw error;
        }
    }

    // Cerrar sesión
    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
    }

    // Guardar datos de autenticación
    setAuthData(data) {
        this.token = data.token;
        this.user = data.user;
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
    }

    // Verificar si el usuario está autenticado
    isAuthenticated() {
        return !!this.token && !!this.user;
    }

    // Obtener token actual
    getToken() {
        return this.token;
    }

    // Obtener usuario actual
    getUser() {
        return this.user;
    }

    // Verificar si el usuario tiene un rol específico
    hasRole(role) {
        return this.user && this.user.role === role;
    }

    // Verificar si es entrenador
    isTrainer() {
        return this.hasRole('entrenador');
    }

    // Verificar si es atleta
    isAthlete() {
        return this.hasRole('atleta');
    }

    // Obtener headers con autorización
    getAuthHeaders() {
        if (this.token) {
            return {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            };
        }
        return {
            'Content-Type': 'application/json'
        };
    }
}

// Exportar instancia singleton
export default new AuthService();
