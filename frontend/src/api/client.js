import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
    timeout: 60000,  // Increased timeout for Render cold starts
})

// Document endpoints
export const uploadDocument = (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
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

// Query endpoints
export const query = (data) => {
    return api.post('/query', data)
}

export const getQueryHistory = (limit = 10) => {
    return api.get('/query/history', { params: { limit } })
}

// NEW Export endpoints (Chat History)
export const exportConversation = (data) => {
    return api.post('/export/conversation', data, {
        responseType: 'blob'
    })
}

export const exportConversationsBatch = (data) => {
    return api.post('/export/conversations/batch', data, {
        responseType: 'blob'
    })
}

export const getExportFormats = () => {
    return api.get('/export/formats')
}

// Health check
export const healthCheck = () => {
    return api.get('/health')
}

export default api
