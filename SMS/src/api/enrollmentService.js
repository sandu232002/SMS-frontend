import api from './axiosConfig';

const BASE = '/api/enrollments';

export const EnrollmentService = {
    /**
     * Create a new enrollment.
     * @param {Object} enrollmentData - studentId, courseId, academicYear, semester
     * @returns {Promise<Object>}
     */
    createEnrollment: async (enrollmentData) => {
        const response = await api.post(`${BASE}`, enrollmentData);
        return response.data;
    },

    /**
     * Get enrollments, optionally filtered.
     * @param {Object} filters - optional studentId, courseId, academicYear, semester
     * @returns {Promise<Array>}
     */
    getEnrollments: async (filters = {}) => {
        const response = await api.get(`${BASE}`, { params: filters });
        return response.data;
    },

    /**
     * Update enrollment status.
     * @param {number} id
     * @param {string} status - e.g., 'ACTIVE', 'COMPLETED'
     * @returns {Promise<Object>}
     */
    updateEnrollmentStatus: async (id, status) => {
        const response = await api.patch(`${BASE}/${id}/status`, { status });
        return response.data;
    },

    /**
     * Delete enrollment.
     * @param {number} id
     * @returns {Promise<Object>}
     */
    deleteEnrollment: async (id) => {
        const response = await api.delete(`${BASE}/${id}`);
        return response.data;
    }
};

export default EnrollmentService;
