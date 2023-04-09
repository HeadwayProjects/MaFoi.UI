import React from "react";
import { preventDefault } from "../../utils/common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUpload, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Tooltip from 'react-bootstrap/Tooltip';
import "./Icon.css";

function Icon({ className, name, action, data, style, disabled, text }) {
    function onClick(event) {
        preventDefault(event);
        if (action && !disabled) {
            action(data);
        }
    }

    return (
        <OverlayTrigger overlay={<Tooltip>{text || name}</Tooltip>}
            placement="bottom" delay={{ show: 500 }}>
            <span className={`btn-icon ${className}`} style={style} onClick={onClick} disabled={disabled}>
                {{
                    'download': (
                        <svg width="18" height="18" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.75 7.875V9.75H2.25V7.875H1V9.75C1 10.4375 1.5625 11 2.25 11H9.75C10.4375 11 11 10.4375 11 9.75V7.875H9.75Z" fill="var(--bs-blue)" />
                            <path d="M9.125 5.375L8.24375 4.49375L6.625 6.10625L6.625 1L5.375 1L5.375 6.10625L3.75625 4.49375L2.875 5.375L6 8.5L9.125 5.375Z" fill="var(--bs-blue)" />
                        </svg>
                    ),
                    'edit': (
                        <svg width="18" height="18" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.5 10.8499C2.225 10.8499 1.9895 10.7521 1.7935 10.5564C1.5975 10.3607 1.49967 10.1252 1.5 9.8499V2.8499C1.5 2.5749 1.598 2.3394 1.794 2.1434C1.99 1.9474 2.22533 1.84957 2.5 1.8499H6.9625L5.9625 2.8499H2.5V9.8499H9.5V6.3749L10.5 5.3749V9.8499C10.5 10.1249 10.402 10.3604 10.206 10.5564C10.01 10.7524 9.77467 10.8502 9.5 10.8499H2.5ZM8.0875 2.1374L8.8 2.8374L5.5 6.1374V6.8499H6.2L9.5125 3.5374L10.225 4.2374L6.9125 7.5499C6.82083 7.64157 6.7145 7.71457 6.5935 7.7689C6.4725 7.82324 6.3455 7.85024 6.2125 7.8499H5C4.85833 7.8499 4.7395 7.8019 4.6435 7.7059C4.5475 7.6099 4.49967 7.49124 4.5 7.3499V6.1374C4.5 6.00407 4.525 5.8769 4.575 5.7559C4.625 5.6349 4.69583 5.52874 4.7875 5.4374L8.0875 2.1374ZM10.225 4.2374L8.0875 2.1374L9.3375 0.887402C9.5375 0.687402 9.77717 0.587402 10.0565 0.587402C10.3358 0.587402 10.5712 0.687402 10.7625 0.887402L11.4625 1.5999C11.6542 1.79157 11.75 2.0249 11.75 2.2999C11.75 2.5749 11.6542 2.80824 11.4625 2.9999L10.225 4.2374Z" fill="var(--bs-green)" />
                        </svg>
                    ),
                    'view': (
                        <svg width="18" height="18" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 4.5C6.39782 4.5 6.77936 4.65804 7.06066 4.93934C7.34196 5.22064 7.5 5.60218 7.5 6C7.5 6.39782 7.34196 6.77936 7.06066 7.06066C6.77936 7.34196 6.39782 7.5 6 7.5C5.60218 7.5 5.22064 7.34196 4.93934 7.06066C4.65804 6.77936 4.5 6.39782 4.5 6C4.5 5.60218 4.65804 5.22064 4.93934 4.93934C5.22064 4.65804 5.60218 4.5 6 4.5ZM6 2.25C8.5 2.25 10.635 3.805 11.5 6C10.635 8.195 8.5 9.75 6 9.75C3.5 9.75 1.365 8.195 0.5 6C1.365 3.805 3.5 2.25 6 2.25ZM1.59 6C1.99413 6.82515 2.62165 7.52037 3.40124 8.00663C4.18083 8.49288 5.0812 8.75066 6 8.75066C6.9188 8.75066 7.81917 8.49288 8.59876 8.00663C9.37835 7.52037 10.0059 6.82515 10.41 6C10.0059 5.17485 9.37835 4.47963 8.59876 3.99337C7.81917 3.50712 6.9188 3.24934 6 3.24934C5.0812 3.24934 4.18083 3.50712 3.40124 3.99337C2.62165 4.47963 1.99413 5.17485 1.59 6Z" fill="var(--bs-green)" />
                        </svg>
                    ),
                    'delete': (
                        <FontAwesomeIcon icon={faTrash} />
                    ),
                    'upload': (
                        <FontAwesomeIcon icon={faUpload} />
                    ),
                    'info': (
                        <FontAwesomeIcon icon={faInfoCircle} />
                    )
                }[name]}
            </span>
        </OverlayTrigger>
    )
}

export default Icon;