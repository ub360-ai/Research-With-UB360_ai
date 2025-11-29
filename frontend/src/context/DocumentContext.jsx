import { createContext, useContext, useState, useEffect } from 'react'
import { listDocuments, uploadDocument, uploadURL, deleteDocument } from '../api/client'
import toast from 'react-hot-toast'

const DocumentContext = createContext()

export function DocumentProvider({ children }) {
    const [documents, setDocuments] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchDocuments = async () => {
        try {
            setLoading(true)
            const response = await listDocuments()
            setDocuments(response.data.documents || [])
        } catch (error) {
            console.error('Error fetching documents:', error)
            toast.error('Failed to load documents')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDocuments()
    }, [])

    const handleUploadFile = async (file) => {
        try {
            setLoading(true)
            const response = await uploadDocument(file)
            toast.success(`Uploaded: ${response.data.filename}`)
            await fetchDocuments()
            return response.data
        } catch (error) {
            console.error('Error uploading file:', error)
            toast.error('Failed to upload file')
            throw error
        } finally {
            setLoading(false)
        }
    }

    const handleUploadURL = async (url) => {
        try {
            setLoading(true)
            const response = await uploadURL(url)
            toast.success(`Scraped: ${response.data.filename}`)
            await fetchDocuments()
            return response.data
        } catch (error) {
            console.error('Error uploading URL:', error)
            toast.error('Failed to scrape URL')
            throw error
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteDocument = async (id) => {
        try {
            setLoading(true)
            await deleteDocument(id)
            toast.success('Document deleted')
            await fetchDocuments()
        } catch (error) {
            console.error('Error deleting document:', error)
            toast.error('Failed to delete document')
        } finally {
            setLoading(false)
        }
    }

    return (
        <DocumentContext.Provider
            value={{
                documents,
                loading,
                uploadFile: handleUploadFile,
                uploadURL: handleUploadURL,
                deleteDocument: handleDeleteDocument,
                refreshDocuments: fetchDocuments,
            }}
        >
            {children}
        </DocumentContext.Provider>
    )
}

export const useDocuments = () => useContext(DocumentContext)
