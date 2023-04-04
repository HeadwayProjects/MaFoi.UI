import React, { useEffect } from "react";
import '../shared/PageLoader.css';

function PageLoader({ message = 'Please wait...' }) {
    useEffect(() => {
        window.document.body.style.overflow = 'hidden';
        return () => {
            window.document.body.style.overflow = 'auto';
        }
    }, []);
    return (
        <div className="pageload-overlay">
            <div className="pageload-container">
                <div className="spinner-border text-primary" role="status">
                </div>
                <p className="mt-2 mb-0">{message}</p>
            </div>
        </div>
    )
}

export default PageLoader;