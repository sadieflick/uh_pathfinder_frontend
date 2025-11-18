// src/lib/apiClient.ts
import axios from 'axios';

// Get API URL from environment or use localhost as default
// For production deployment, set VITE_API_URL environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Create a single, configured axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Log the API URL in development
if (import.meta.env.DEV) {
  console.log(`API Client configured for: ${API_BASE_URL}`);
}

export default apiClient;