import api from './axiosConfig';

const BASE = '/api/students';

export const StudentService = {
    /**
     * Create a new student.
     * @param {Object} studentData - firstName, lastName, address, dateOfBirth, degreeProgramId
     * @returns {Promise<Object>}
     */
    createStudent: async (studentData) => {
        const response = await api.post(`${BASE}`, studentData);
        return response.data;
    },

    /**
     * Get students, optionally filtered by search query.
     * @param {string} search - filter by name/number
     * @returns {Promise<Array>}
     */
    getStudents: async (search) => {
        const params = search ? { search } : {};
        const response = await api.get(`${BASE}`, { params });
        return response.data;
    },

    /**
     * Get student by ID.
     * @param {number} id
     * @returns {Promise<Object>}
     */
    getStudentById: async (id) => {
        const response = await api.get(`${BASE}/${id}`);
        return response.data;
    },

    /**
     * Get student by student number.
     * @param {string} studentNumber
     * @returns {Promise<Object>}
     */
    getStudentByNumber: async (studentNumber) => {
        const response = await api.get(`${BASE}/number/${studentNumber}`);
        return response.data;
    },

    /**
     * Update student details.
     * @param {number} id
     * @param {Object} studentData - fields to update
     * @returns {Promise<Object>}
     */
    updateStudent: async (id, studentData) => {
        const response = await api.put(`${BASE}/${id}`, studentData);
        return response.data;
    },

    /**
     * Delete student.
     * @param {number} id
     * @returns {Promise<Object>}
     */
    deleteStudent: async (id) => {
        const response = await api.delete(`${BASE}/${id}`);
        return response.data;
    },

    /**
     * Get all degree programs.
     * @returns {Promise<Array>}
     */
    getDegreePrograms: async () => {
        const response = await api.get(`${BASE}/degree-programs`);
        return response.data;
    },

    /**
     * Create a new degree program.
     * @param {Object} programData - degreeName, departmentName, creditValue, durationYears
     * @returns {Promise<Object>}
     */
    createDegreeProgram: async (programData) => {
        const response = await api.post(`${BASE}/degree-programs`, programData);
        return response.data;
    },

    /**
     * Update a degree program.
     * @param {number} id
     * @param {Object} programData
     * @returns {Promise<Object>}
     */
    updateDegreeProgram: async (id, programData) => {
        const response = await api.put(`${BASE}/degree-programs/${id}`, programData);
        return response.data;
    },

    /**
     * Delete a degree program.
     * @param {number} id
     * @returns {Promise<Object>}
     */
    deleteDegreeProgram: async (id) => {
        const response = await api.delete(`${BASE}/degree-programs/${id}`);
        return response.data;
    }
};

export default StudentService;
