import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import "./Preview.css";
import { Button } from "react-bootstrap";

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
            <Button className="btn btn-outline-secondary closeBtn" onClick={onClose}>Close Or Esc</Button>
            <iframe src={`https://docs.google.com/gview?url=${documentUrl}&embedded=true`} />
        </div>
    )
}

export default Preview;