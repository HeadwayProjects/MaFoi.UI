import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import "./Preview.css";

const DocType = {
    PDF: 'application/pdf'
}

function Preview({ documentUrl, documentType = DocType.PDF, onClose }) {

    function escFunction(event) {
        if (event.key === "Escape" && onClose) {
           onClose();
        }
    }


    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, [escFunction]);



    return (
        <div className="previewOverlay 2">
            <FontAwesomeIcon icon={faClose} className="closeBtn" onClick={onClose} />
            <iframe src={`https://docs.google.com/gview?url=${documentUrl}&embedded=true`} />
        </div>
    )
}

export default Preview;