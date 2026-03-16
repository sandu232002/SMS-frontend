import api from './axiosConfig';

const BASE = '/api/courses';

export const CourseService = {
    /**
     * Create a new course.
     * @param {Object} courseData - courseCode, courseName, creditValue, semester
     * @returns {Promise<Object>}
     */
    createCourse: async (courseData) => {
        const response = await api.post(`${BASE}`, courseData);
        return response.data;
    },

    /**
     * Get courses, optionally filtered.
     * @param {Object} filters - optional search, semester
     * @returns {Promise<Array>}
     */
    getCourses: async (filters = {}) => {
        const response = await api.get(`${BASE}`, { params: filters });
        return response.data;
    },

    /**
     * Get course by ID.
     * @param {number} id
     * @returns {Promise<Object>}
     */
    getCourseById: async (id) => {
        const response = await api.get(`${BASE}/${id}`);
        return response.data;
    },

    /**
     * Update course details.
     * @param {number} id
     * @param {Object} courseData - name, credits, semester
     * @returns {Promise<Object>}
     */
    updateCourse: async (id, courseData) => {
        const response = await api.put(`${BASE}/${id}`, courseData);
        return response.data;
    },

    /**
     * Delete course.
     * @param {number} id
     * @returns {Promise<Object>}
     */
    deleteCourse: async (id) => {
        const response = await api.delete(`${BASE}/${id}`);
        return response.data;
    }
};

export default CourseService;
