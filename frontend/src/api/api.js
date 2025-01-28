import axios from 'axios';

// Backend Base URL
const BASE_URL = "http://127.0.0.1:8000"; // Update with your backend's URL if different

// POST API: Upload SQL file
export const uploadSQLFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await axios.post(`${BASE_URL}/sql/upload/`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
};

// GET API: Execute business logic and get lineage data
export const fetchLineageData = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/sql/process/`);
        return response.data;
    } catch (error) {
        console.error("Error fetching lineage data:", error);
        throw error;
    }
};
