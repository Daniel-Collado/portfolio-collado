import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./CertificateModal.css";
import { trackCredentialOpen } from "../../lib/analytics/analytics";
import { useDialogFocus } from "../../hooks/useDialogFocus";

const CertificateModal = ({ certificate, onClose }) => {
    const { t, i18n } = useTranslation();
    const dialogRef = useDialogFocus({ active: Boolean(certificate), onClose });
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
    const currentLang = i18n.language.split("-")[0];
    const localizedTitle =
        certificate[`title_${currentLang}`] ||
        certificate.title_es ||
        certificate.title_en ||
        t("certificate_untitled");
    const isPdf = certificate.certificate_url?.toLowerCase().endsWith(".pdf");

    const previewUrl = isPdf
        ? certificate.certificate_url
              .replace("/upload/", "/upload/pg_1,f_jpg/")
              .replace(/\.pdf$/i, "")
        : certificate.certificate_url;
    return (
        <div className="certificate-modal-backdrop" onMouseDown={onClose}>
            <div
                ref={dialogRef}
                className="certificate-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="certificate-modal-title"
                tabIndex="-1"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <button
                    className="certificate-modal-close"
                    onClick={onClose}
                    aria-label={t("close_certificate")}
                >
                    ×
                </button>

                <img
                    src={previewUrl}
                    alt={t("certificate_preview_alt", {
                        title: localizedTitle,
                    })}
                    className="certificate-modal-image"
                />

                <h3 id="certificate-modal-title">{localizedTitle}</h3>

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
                        {t("view_official_credential")}
                    </a>
                )}
            </div>
        </div>
    );
};

export default CertificateModal;
