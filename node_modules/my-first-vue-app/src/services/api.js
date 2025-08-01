import axios from 'axios';

// Configuración base de la API
const apiClient = axios.create({
    baseURL: process.env.VUE_APP_API_URL, // Cambia esto por la URL de tu API de CrossFit
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000 // 10 segundos de timeout
});

// Interceptor para manejo de errores
apiClient.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error.message);
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
        return apiClient.put(`/workouts/${id}`, wodData);
    },

    deleteWod(id) {
        return apiClient.delete(`/workouts/${id}`);
    }
    ,
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
        return apiClient.put(`/members/${id}`, memberData);
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
        return apiClient.put(`/records/${id}`, recordData);
    },
    deleteRecord(id) {
        return apiClient.delete(`/records/${id}`);
    }
};
