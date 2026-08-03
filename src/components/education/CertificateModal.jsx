import { useEffect } from "react";
import "./CertificateModal.css";
import { trackCredentialOpen } from "../../lib/analytics/analytics";

const CertificateModal = ({ certificate, onClose }) => {
    useEffect(() => {
        if (!certificate) {
            return;
        }

        const previousHtmlOverflow = document.documentElement.style.overflow;
        const previousBodyOverflow = document.body.style.overflow;

        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";

        return () => {
            document.documentElement.style.overflow = previousHtmlOverflow;
            document.body.style.overflow = previousBodyOverflow;
        };
    }, [certificate]);

    if (!certificate) {
        return null;
    }
    const isPdf = certificate.certificate_url?.toLowerCase().endsWith(".pdf");

    const previewUrl = isPdf
        ? certificate.certificate_url
              .replace("/upload/", "/upload/pg_1,f_jpg/")
              .replace(/\.pdf$/i, "")
        : certificate.certificate_url;
    return (
        <div className="certificate-modal-backdrop" onClick={onClose}>
            <div
                className="certificate-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="certificate-modal-close"
                    onClick={onClose}
                    aria-label="Cerrar"
                >
                    ×
                </button>

                <img
                    src={previewUrl}
                    alt={certificate.title}
                    className="certificate-modal-image"
                />

                <h3>{certificate.title}</h3>

                <p>{certificate.year}</p>

                {certificate.credential_url && (
                    <a
                        href={certificate.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link"
                        onClick={() =>
                            trackCredentialOpen(
                                certificate.title_es,
                                certificate.category
                            )
                        }
                    >
                        Ver credencial oficial
                    </a>
                )}
            </div>
        </div>
    );
};

export default CertificateModal;
