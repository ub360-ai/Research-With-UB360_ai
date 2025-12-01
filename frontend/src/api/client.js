/**
 * API Client Configuration
 * Optimized for Choreo deployment with retry logic and error handling
 */
import axios from 'axios'

// Get API URL from environment or use localhost for development
const API_URL = import.meta.env.VITE_API_URL || '/choreo-apis/default/research-assistant-api/v1/api/v1'

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    timeout: 60000, // 60 seconds for ML operations
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor - Add auth token if available
api.interceptors.request.use(
    (config) => {
        // Add timestamp to prevent caching
        config.params = {
            ...config.params,
            _t: Date.now(),
        }

        // Add auth token if available (for future use)
        const token = localStorage.getItem('auth_token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error) => {
        console.error('Request error:', error)
        return Promise.reject(error)
    }
)

// Response interceptor - Handle errors and retries
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        // Handle rate limiting (429)
        if (error.response?.status === 429) {
            const retryAfter = error.response.headers['retry-after'] || 60
            console.warn(`Rate limited. Retry after ${retryAfter}s`)

            // Don't retry automatically for rate limits
            return Promise.reject({
                ...error,
                message: `Rate limit exceeded. Please wait ${retryAfter} seconds.`,
            })
        }

        // Handle server errors (500+) with retry
        if (error.response?.status >= 500 && !originalRequest._retry) {
            originalRequest._retry = true

            // Wait 2 seconds before retry
            await new Promise(resolve => setTimeout(resolve, 2000))

            return api(originalRequest)
        }

        // Handle network errors
        if (!error.response) {
            console.error('Network error:', error.message)
            return Promise.reject({
                ...error,
                message: 'Network error. Please check your connection.',
            })
        }

        return Promise.reject(error)
    }
)

// ============= Document Endpoints =============

export const uploadDocument = (file, onProgress) => {
    const formData = new FormData()
    formData.append('file', file)

    return api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
                const percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                )
                onProgress(percentCompleted)
            }
        },
    })
}

export const uploadURL = (url) => {
    return api.post('/documents/upload-url', null, { params: { url } })
}

export const listDocuments = () => {
    return api.get('/documents')
}

export const getDocument = (id) => {
    return api.get(`/documents/${id}`)
}

export const deleteDocument = (id) => {
    return api.delete(`/documents/${id}`)
}

export const renameDocument = (id, newName) => {
    return api.patch(`/documents/${id}/rename`, null, {
        params: { new_name: newName }
    })
}

export const downloadDocument = (id, watermark = true) => {
    return api.get(`/documents/${id}/download`, {
        params: { watermark },
        responseType: 'blob'
    })
}

// ============= Query Endpoints =============

export const query = (data) => {
    return api.post('/query', data)
}

export const getQueryHistory = (limit = 10) => {
    return api.get('/query/history', { params: { limit } })
}

// ============= Export Endpoints =============

export const exportConversation = (data) => {
    return api.post('/export/conversation', data, {
        responseType: 'blob',
        timeout: 120000, // 2 minutes for large exports
    })
}

export const exportConversationsBatch = (data) => {
    return api.post('/export/conversations/batch', data, {
        responseType: 'blob',
        timeout: 180000, // 3 minutes for batch exports
    })
}

export const getExportFormats = () => {
    return api.get('/export/formats')
}

// ============= Health Check =============

export const healthCheck = () => {
    return api.get('/health', {
        timeout: 5000, // 5 seconds for health check
    })
}

// ============= Utility Functions =============

/**
 * Check if API is reachable
 */
export const checkAPIConnection = async () => {
    try {
        await healthCheck()
        return { connected: true, url: API_URL }
    } catch (error) {
        return {
            connected: false,
            url: API_URL,
            error: error.message
        }
    }
}

/**
 * Get API configuration info
 */
export const getAPIInfo = () => {
    return {
        baseURL: API_URL,
        timeout: api.defaults.timeout,
        environment: import.meta.env.MODE,
    }
}

export default api
