import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'x-user': 'admin' // Mock user for audit
    }
});

export const getResiduos = () => api.get('/residuos');
export const createResiduo = (data) => api.post('/residuos', data);
export const updateResiduo = (id, data) => api.put(`/residuos/${id}`, data);
export const deleteResiduo = (id) => api.delete(`/residuos/${id}`);

export const getHistorial = () => api.get('/historial');
export const createHistorial = (data) => api.post('/historial', data);
export const deleteHistorial = (id) => api.delete(`/historial/${id}`);

export const getCumplimiento = () => api.get('/cumplimiento');
export const createCumplimiento = (data) => api.post('/cumplimiento', data);
export const updateCumplimiento = (id, data) => api.put(`/cumplimiento/${id}`, data);
export const deleteCumplimiento = (id) => api.delete(`/cumplimiento/${id}`);

export const getCatalogos = () => api.get('/catalogos');

export const getKpis = () => api.get('/kpis');
export const getReporteTipo = () => api.get('/reportes/tipo');
export const getReportePeriodo = () => api.get('/reportes/periodo');
export const getReporteArea = () => api.get('/reportes/area');
export const getReporteCumplimiento = () => api.get('/reportes/cumplimiento');
export const getAuditoria = () => api.get('/auditoria');

export default api;
