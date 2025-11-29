import { AlertCircle } from 'lucide-react'

export default function PrivacyNotice() {
    return (
        <div className="privacy-notice">
            <div className="privacy-content">
                <AlertCircle size={20} />
                <p>
                    <strong>Privacy First:</strong> Your documents and chat histories are automatically
                    deleted after 48 hours. Export important conversations before they expire.
                    Your data never leaves this platform.
                </p>
            </div>

            <style jsx>{`
                .privacy-notice {
                    background: linear-gradient(135deg, #10A37F 0%, #0d8a6a 100%);
                    color: white;
                    padding: 1rem 1.5rem;
                    border-radius: 8px;
                    margin-bottom: 1.5rem;
                    box-shadow: 0 2px 8px rgba(16, 163, 127, 0.2);
                }
                
                .privacy-content {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                
                .privacy-content p {
                    margin: 0;
                    font-size: 0.95rem;
                    line-height: 1.5;
                }
                
                .privacy-content strong {
                    font-weight: 600;
                }
            `}</style>
        </div>
    )
}
