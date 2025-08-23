import { defineStore } from 'pinia';
import authService from '../services/authService';

// Store de autenticación
export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: authService.getUser(),
        token: authService.getToken(),
        isAuthenticated: authService.isAuthenticated()
    }),

    getters: {
        isTrainer: (state) => state.user?.role === 'entrenador',
        isAthlete: (state) => state.user?.role === 'atleta',
        userName: (state) => state.user?.name || '',
        userEmail: (state) => state.user?.email || ''
    },

    actions: {
        async login(credentials) {
            try {
                const response = await authService.login(credentials);
                this.user = authService.getUser();
                this.token = authService.getToken();
                this.isAuthenticated = authService.isAuthenticated();
                return response;
            } catch (error) {
                this.logout();
                throw error;
            }
        },

        async register(userData) {
            try {
                const response = await authService.register(userData);
                this.user = authService.getUser();
                this.token = authService.getToken();
                this.isAuthenticated = authService.isAuthenticated();
                return response;
            } catch (error) {
                this.logout();
                throw error;
            }
        },

        logout() {
            authService.logout();
            this.user = null;
            this.token = null;
            this.isAuthenticated = false;
        },

        // Verificar y actualizar estado de autenticación
        checkAuth() {
            this.user = authService.getUser();
            this.token = authService.getToken();
            this.isAuthenticated = authService.isAuthenticated();
        }
    }
});

export const useWodStore = defineStore('wod', {
    state: () => ({
        wods: []
    }),
    actions: {
        setWods(wods) {
            this.wods = wods;
        }
    }
});

export const useMemberStore = defineStore('member', {
    state: () => ({
        members: []
    }),
    actions: {
        setMembers(members) {
            this.members = members;
        }
    }
});

export const useRecordStore = defineStore('record', {
    state: () => ({
        records: []
    }),
    actions: {
        setRecords(records) {
            this.records = records;
        }
    }
});
