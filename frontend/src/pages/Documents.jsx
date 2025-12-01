import { useState } from 'react'
import { useDocuments } from '../context/DocumentContext'
import { useDropzone } from 'react-dropzone'
import { Upload, Link as LinkIcon, FileText, Trash2, Loader, Edit2, Download, Check, X as XIcon } from 'lucide-react'
import { renameDocument, downloadDocument } from '../util'
import toast from 'react-hot-toast'
import PrivacyNotice from '../components/common/PrivacyNotice'

export default function Documents() {
    const { documents, loading, uploadFile, uploadURL, deleteDocument, refreshDocuments } = useDocuments()
    const [urlInput, setUrlInput] = useState('')
    const [uploading, setUploading] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [editingName, setEditingName] = useState('')
    const [downloading, setDownloading] = useState(null)

    const onDrop = async (acceptedFiles) => {
        for (const file of acceptedFiles) {
            try {
                setUploading(true)
                await uploadFile(file)
            } catch (error) {
                // Error handled in context
            } finally {
                setUploading(false)
            }
        }
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'text/plain': ['.txt'],
            'text/markdown': ['.md'],
        },
    })

    const handleURLSubmit = async (e) => {
        e.preventDefault()
        if (urlInput.trim()) {
            try {
                setUploading(true)
                await uploadURL(urlInput.trim())
                setUrlInput('')
            } catch (error) {
                // Error handled in context
            } finally {
                setUploading(false)
            }
        }
    }

    const handleDelete = async (id, filename) => {
        if (window.confirm(`Delete "${filename}"?`)) {
            await deleteDocument(id)
        }
    }

    const startRename = (doc) => {
        setEditingId(doc.document_id)
        setEditingName(doc.filename)
    }

    const cancelRename = () => {
        setEditingId(null)
        setEditingName('')
    }

    const saveRename = async (docId) => {
        if (!editingName.trim()) {
            toast.error('Filename cannot be empty')
            return
        }

        try {
            await renameDocument(docId, editingName.trim())
            toast.success('Document renamed successfully!')
            setEditingId(null)
            setEditingName('')
            refreshDocuments()
        } catch (error) {
            console.error('Rename error:', error)
            toast.error('Failed to rename document')
        }
    }

    const handleDownload = async (doc) => {
        try {
            setDownloading(doc.document_id)
            const response = await downloadDocument(doc.document_id, true) // with watermark

            // Extract filename from response headers or use default
            const contentDisposition = response.headers['content-disposition']
            let filename = `${doc.filename}..Follow ub360_ai on x.${doc.document_type.toLowerCase()}`

            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="?(.+)"?/)
                if (filenameMatch) {
                    filename = filenameMatch[1]
                }
            }

            // Create download link
            const url = window.URL.createObjectURL(response.data)
            const a = document.createElement('a')
            a.href = url
            a.download = filename
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)

            toast.success('Document downloaded with UB360.ai watermark!')
        } catch (error) {
            console.error('Download error:', error)
            toast.error('Failed to download document')
        } finally {
            setDownloading(null)
        }
    }

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B'
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
    }

    return (
        <div className="h-[calc(100vh-8rem)] sm:h-[calc(100vh-13rem)] overflow-y-auto chat-scrollbar">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 max-w-4xl">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-8">
                    Document Management
                </h1>

                {/* Privacy Notice */}
                <PrivacyNotice />

                {/* Upload Section */}
                <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                    {/* File Upload */}
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg p-6 sm:p-12 text-center cursor-pointer transition-colors touch-manipulation ${isDragActive
                            ? 'border-chat-accent bg-chat-accent/5'
                            : 'border-gray-300 dark:border-gray-600 hover:border-chat-accent active:border-chat-accent'
                            }`}
                    >
                        <input {...getInputProps()} />
                        <Upload className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-400" />
                        <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-1 sm:mb-2">
                            {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            or tap to browse • PDF, DOCX, TXT, MD
                        </p>
                    </div>

                    {/* URL Upload */}
                    <form onSubmit={handleURLSubmit} className="flex flex-col sm:flex-row gap-2 sm:gap-2">
                        <div className="flex-1 relative">
                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="url"
                                value={urlInput}
                                onChange={(e) => setUrlInput(e.target.value)}
                                placeholder="Enter URL to scrape"
                                className="w-full pl-10 pr-4 py-3 sm:py-3 min-h-[48px] rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-chat-accent text-sm sm:text-base"
                                disabled={uploading}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!urlInput.trim() || uploading}
                            className="w-full sm:w-auto px-6 py-3 min-h-[48px] bg-chat-accent text-white rounded-lg hover:bg-chat-accent/90 active:bg-chat-accent/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium touch-manipulation"
                        >
                            {uploading ? 'Uploading...' : 'Add URL'}
                        </button>
                    </form>
                </div>

                {/* Documents List */}
                <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                        Your Documents ({documents.length})
                    </h2>

                    {loading && documents.length === 0 ? (
                        <div className="text-center py-12">
                            <Loader className="w-8 h-8 animate-spin mx-auto text-chat-accent" />
                        </div>
                    ) : documents.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            No documents uploaded yet
                        </div>
                    ) : (
                        <div className="grid gap-3 sm:gap-4">
                            {documents.map((doc) => (
                                <div
                                    key={doc.document_id}
                                    className="p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-chat-accent active:border-chat-accent transition-colors"
                                >
                                    <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                                        <div className="flex items-start gap-3 flex-1 min-w-0">
                                            <FileText className="w-5 h-5 text-chat-accent flex-shrink-0 mt-0.5" />
                                            <div className="flex-1 min-w-0">
                                                {/* Editable Filename */}
                                                {editingId === doc.document_id ? (
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <input
                                                            type="text"
                                                            value={editingName}
                                                            onChange={(e) => setEditingName(e.target.value)}
                                                            className="flex-1 px-3 py-1 text-sm border border-chat-accent rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-chat-accent"
                                                            autoFocus
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') saveRename(doc.document_id)
                                                                if (e.key === 'Escape') cancelRename()
                                                            }}
                                                        />
                                                        <button
                                                            onClick={() => saveRename(doc.document_id)}
                                                            className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"
                                                            title="Save"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={cancelRename}
                                                            className="p-1 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                                            title="Cancel"
                                                        >
                                                            <XIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                                                        {doc.filename}
                                                    </h3>
                                                )}

                                                <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="uppercase">{doc.document_type}</span>
                                                    <span>•</span>
                                                    <span>{formatFileSize(doc.file_size)}</span>
                                                    <span>•</span>
                                                    <span>{doc.num_chunks} chunks</span>
                                                    <span>•</span>
                                                    <span>{formatDate(doc.upload_date)}</span>
                                                </div>
                                                {doc.metadata && (
                                                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                                        {doc.metadata.total_pages && (
                                                            <span className="mr-3">📄 {doc.metadata.total_pages} pages</span>
                                                        )}
                                                        {doc.metadata.author && (
                                                            <span className="mr-3">✍️ {doc.metadata.author}</span>
                                                        )}
                                                        {doc.metadata.url && (
                                                            <a
                                                                href={doc.metadata.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-chat-accent hover:underline"
                                                            >
                                                                🔗 View source
                                                            </a>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center gap-1 sm:gap-1 w-full sm:w-auto justify-end">
                                            <button
                                                onClick={() => startRename(doc)}
                                                className="p-2 sm:p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-blue-600 hover:bg-blue-50 active:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors touch-manipulation"
                                                title="Rename document"
                                                disabled={editingId !== null}
                                            >
                                                <Edit2 className="w-5 h-5 sm:w-4 sm:h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDownload(doc)}
                                                className="p-2 sm:p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-chat-accent hover:bg-chat-accent/10 active:bg-chat-accent/20 rounded-lg transition-colors touch-manipulation"
                                                title="Download with UB360.ai watermark"
                                                disabled={downloading === doc.document_id}
                                            >
                                                {downloading === doc.document_id ? (
                                                    <Loader className="w-5 h-5 sm:w-4 sm:h-4 animate-spin" />
                                                ) : (
                                                    <Download className="w-5 h-5 sm:w-4 sm:h-4" />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(doc.document_id, doc.filename)}
                                                className="p-2 sm:p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-red-500 hover:bg-red-50 active:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors touch-manipulation"
                                                title="Delete document"
                                            >
                                                <Trash2 className="w-5 h-5 sm:w-4 sm:h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
