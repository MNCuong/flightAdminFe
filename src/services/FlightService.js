import axios from '../services/api';

const API_URL = '/flights';

export default {
    getAll() {
        return axios.get(API_URL);
    },
    get(id) {
        return axios.get(`${API_URL}/${id}`);
    },
    create(flight) {
        return axios.post(API_URL, flight);
    },
    update(id, flight) {
        return axios.put(`${API_URL}/${id}`, flight);
    },
    delete(id) {
        return axios.delete(`${API_URL}/${id}`);
    }
};
