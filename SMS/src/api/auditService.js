import api from './axiosConfig';

const BASE = '/api/audit';

export const AuditService = {
    /**
     * Create a new audit log entry.
     * @param {Object} logData - adminId, entityName, entityId, actionType, description
     * @returns {Promise<Object>}
     */
    logAction: async (logData) => {
        const response = await api.post(`${BASE}/log`, logData);
        return response.data;
    },

    /**
     * Get paged audit logs.
     * @param {number} page
     * @param {number} size
     * @returns {Promise<Object>}
     */
    getLogs: async (page = 0, size = 10) => {
        const response = await api.get(`${BASE}`, { params: { page, size } });
        return response.data;
    },

    /**
     * Get logs filtered by admin ID.
     * @param {number} adminId
     * @returns {Promise<Array>}
     */
    getLogsByAdminId: async (adminId) => {
        const response = await api.get(`${BASE}/admin/${adminId}`);
        return response.data;
    },

    /**
     * Get logs filtered by entity name and ID.
     * @param {string} entityName
     * @param {number} entityId
     * @returns {Promise<Array>}
     */
    getLogsByEntity: async (entityName, entityId) => {
        const response = await api.get(`${BASE}/entity/${entityName}/${entityId}`);
        return response.data;
    },

    /**
     * Get logs filtered by action type.
     * @param {string} actionType
     * @returns {Promise<Array>}
     */
    getLogsByActionType: async (actionType) => {
        const response = await api.get(`${BASE}/action/${actionType}`);
        return response.data;
    },

    /**
     * Check audit service health.
     * @returns {Promise<Object>}
     */
    checkHealth: async () => {
        const response = await api.get(`${BASE}/health`);
        return response.data;
    }
};

export default AuditService;
