export default function SectionState({ type, message, retryLabel, onRetry }) {
    const isError = type === "error";

    return (
        <div
            className={`section-state section-state--${type}`}
            role={isError ? "alert" : "status"}
            aria-live="polite"
        >
            {type === "loading" && (
                <span className="section-state-spinner" aria-hidden="true" />
            )}
            <p>{message}</p>
            {isError && onRetry && (
                <button
                    type="button"
                    className="project-link"
                    onClick={onRetry}
                >
                    {retryLabel}
                </button>
            )}
        </div>
    );
}
