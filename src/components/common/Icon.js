import React from "react";
import { preventDefault } from "../../utils/common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faInfoCircle, faSearch, faExternalLink,
    faAngleDoubleLeft, faAngleDoubleRight, faAngleRight, faAngleLeft, faPlus, faAngleDown, faAngleUp
} from "@fortawesome/free-solid-svg-icons";
import "./Icon.css";
import { faEyeSlash } from "@fortawesome/free-regular-svg-icons";

function Icon({ className, name, action, data, style, disabled, text, type }) {
    function onClick(event) {
        preventDefault(event);
        if (action && !disabled) {
            action(data);
        }
    }

    return (
        <>
            {/* // <OverlayTrigger overlay={<Tooltip>{text || name}</Tooltip>}
        //     placement="bottom" delay={{ show: 500 }}> */}
            <span className={`icon icon-${name} ${type === 'button' ? 'btn-icon' : ''} ${className || ''}`}
                style={style} onClick={onClick} disabled={disabled}
                title={text || name}>
                {{
                    th: (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="3" y="3" width="8" height="8" rx="3" />
                            <rect x="3" y="13" width="8" height="8" rx="3" />
                            <rect x="13" y="3" width="8" height="8" rx="3" />
                            <rect x="13" y="13" width="8" height="8" rx="3" />
                        </svg>
                    ),
                    users: (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 5.5C12.9283 5.5 13.8185 5.86875 14.4749 6.52513C15.1313 7.1815 15.5 8.07174 15.5 9C15.5 9.92826 15.1313 10.8185 14.4749 11.4749C13.8185 12.1313 12.9283 12.5 12 12.5C11.0717 12.5 10.1815 12.1313 9.52513 11.4749C8.86875 10.8185 8.5 9.92826 8.5 9C8.5 8.07174 8.86875 7.1815 9.52513 6.52513C10.1815 5.86875 11.0717 5.5 12 5.5ZM5 8C5.56 8 6.08 8.15 6.53 8.42C6.38 9.85 6.8 11.27 7.66 12.38C7.16 13.34 6.16 14 5 14C4.20435 14 3.44129 13.6839 2.87868 13.1213C2.31607 12.5587 2 11.7956 2 11C2 10.2044 2.31607 9.44129 2.87868 8.87868C3.44129 8.31607 4.20435 8 5 8ZM19 8C19.7956 8 20.5587 8.31607 21.1213 8.87868C21.6839 9.44129 22 10.2044 22 11C22 11.7956 21.6839 12.5587 21.1213 13.1213C20.5587 13.6839 19.7956 14 19 14C17.84 14 16.84 13.34 16.34 12.38C17.2119 11.2544 17.6166 9.8362 17.47 8.42C17.92 8.15 18.44 8 19 8ZM5.5 18.25C5.5 16.18 8.41 14.5 12 14.5C15.59 14.5 18.5 16.18 18.5 18.25V20H5.5V18.25ZM0 20V18.5C0 17.11 1.89 15.94 4.45 15.6C3.86 16.28 3.5 17.22 3.5 18.25V20H0ZM24 20H20.5V18.25C20.5 17.22 20.14 16.28 19.55 15.6C22.11 15.94 24 17.11 24 18.5V20Z" />
                        </svg>
                    ),
                    report: (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M7.20005 2.3999C6.56353 2.3999 5.95308 2.65276 5.50299 3.10285C5.05291 3.55293 4.80005 4.16338 4.80005 4.7999V19.1999C4.80005 19.8364 5.05291 20.4469 5.50299 20.897C5.95308 21.347 6.56353 21.5999 7.20005 21.5999H16.8C17.4366 21.5999 18.047 21.347 18.4971 20.897C18.9472 20.4469 19.2 19.8364 19.2 19.1999V8.8967C19.1999 8.26024 18.947 7.64989 18.4968 7.1999L14.4 3.1031C13.9501 2.65298 13.3397 2.40004 12.7032 2.3999H7.20005ZM9.60005 14.3999C9.60005 14.0816 9.47362 13.7764 9.24858 13.5514C9.02353 13.3263 8.71831 13.1999 8.40005 13.1999C8.08179 13.1999 7.77656 13.3263 7.55152 13.5514C7.32648 13.7764 7.20005 14.0816 7.20005 14.3999V17.9999C7.20005 18.3182 7.32648 18.6234 7.55152 18.8484C7.77656 19.0735 8.08179 19.1999 8.40005 19.1999C8.71831 19.1999 9.02353 19.0735 9.24858 18.8484C9.47362 18.6234 9.60005 18.3182 9.60005 17.9999V14.3999ZM12 10.7999C12.3183 10.7999 12.6235 10.9263 12.8486 11.1514C13.0736 11.3764 13.2 11.6816 13.2 11.9999V17.9999C13.2 18.3182 13.0736 18.6234 12.8486 18.8484C12.6235 19.0735 12.3183 19.1999 12 19.1999C11.6818 19.1999 11.3766 19.0735 11.1515 18.8484C10.9265 18.6234 10.8 18.3182 10.8 17.9999V11.9999C10.8 11.6816 10.9265 11.3764 11.1515 11.1514C11.3766 10.9263 11.6818 10.7999 12 10.7999ZM16.8 9.5999C16.8 9.28164 16.6736 8.97642 16.4486 8.75137C16.2235 8.52633 15.9183 8.3999 15.6 8.3999C15.2818 8.3999 14.9766 8.52633 14.7515 8.75137C14.5265 8.97642 14.4 9.28164 14.4 9.5999V17.9999C14.4 18.3182 14.5265 18.6234 14.7515 18.8484C14.9766 19.0735 15.2818 19.1999 15.6 19.1999C15.9183 19.1999 16.2235 19.0735 16.4486 18.8484C16.6736 18.6234 16.8 18.3182 16.8 17.9999V9.5999Z" />
                        </svg>
                    ),
                    task: (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.75 2H10.25C9.69656 2.00002 9.16255 2.20401 8.75004 2.57297C8.33754 2.94194 8.07549 3.44999 8.014 4H6.25C5.65326 4 5.08097 4.23705 4.65901 4.65901C4.23705 5.08097 4 5.65326 4 6.25V19.75C4 20.3467 4.23705 20.919 4.65901 21.341C5.08097 21.7629 5.65326 22 6.25 22H17.75C18.0455 22 18.3381 21.9418 18.611 21.8287C18.884 21.7157 19.1321 21.5499 19.341 21.341C19.5499 21.1321 19.7157 20.884 19.8287 20.611C19.9418 20.3381 20 20.0455 20 19.75V6.25C20 5.95453 19.9418 5.66194 19.8287 5.38896C19.7157 5.11598 19.5499 4.86794 19.341 4.65901C19.1321 4.45008 18.884 4.28434 18.611 4.17127C18.3381 4.0582 18.0455 4 17.75 4H15.986C15.9245 3.44999 15.6625 2.94194 15.25 2.57297C14.8375 2.20401 14.3034 2.00002 13.75 2ZM10.25 3.5H13.75C13.9489 3.5 14.1397 3.57902 14.2803 3.71967C14.421 3.86032 14.5 4.05109 14.5 4.25C14.5 4.44891 14.421 4.63968 14.2803 4.78033C14.1397 4.92098 13.9489 5 13.75 5H10.25C10.0511 5 9.86032 4.92098 9.71967 4.78033C9.57902 4.63968 9.5 4.44891 9.5 4.25C9.5 4.05109 9.57902 3.86032 9.71967 3.71967C9.86032 3.57902 10.0511 3.5 10.25 3.5ZM17.03 11.03L11.53 16.53C11.3894 16.6705 11.1988 16.7493 11 16.7493C10.8012 16.7493 10.6106 16.6705 10.47 16.53L7.97 14.03C7.89631 13.9613 7.83721 13.8785 7.79622 13.7865C7.75523 13.6945 7.73319 13.5952 7.73141 13.4945C7.72963 13.3938 7.74816 13.2938 7.78588 13.2004C7.8236 13.107 7.87974 13.0222 7.95096 12.951C8.02218 12.8797 8.10701 12.8236 8.2004 12.7859C8.29379 12.7482 8.39382 12.7296 8.49452 12.7314C8.59522 12.7332 8.69454 12.7552 8.78654 12.7962C8.87854 12.8372 8.96134 12.8963 9.03 12.97L11 14.94L15.97 9.97C16.0387 9.89631 16.1215 9.83721 16.2135 9.79622C16.3055 9.75523 16.4048 9.73318 16.5055 9.73141C16.6062 9.72963 16.7062 9.74816 16.7996 9.78588C16.893 9.8236 16.9778 9.87974 17.049 9.95096C17.1203 10.0222 17.1764 10.107 17.2141 10.2004C17.2518 10.2938 17.2704 10.3938 17.2686 10.4945C17.2668 10.5952 17.2448 10.6945 17.2038 10.7865C17.1628 10.8785 17.1037 10.9613 17.03 11.03Z" />
                        </svg>
                    ),
                    download: (
                        <svg width="18" height="18" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.75 7.875V9.75H2.25V7.875H1V9.75C1 10.4375 1.5625 11 2.25 11H9.75C10.4375 11 11 10.4375 11 9.75V7.875H9.75Z" />
                            <path d="M9.125 5.375L8.24375 4.49375L6.625 6.10625L6.625 1L5.375 1L5.375 6.10625L3.75625 4.49375L2.875 5.375L6 8.5L9.125 5.375Z" />
                        </svg>
                    ),
                    pencil: (
                        <svg width="18" height="18" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.5 10.8499C2.225 10.8499 1.9895 10.7521 1.7935 10.5564C1.5975 10.3607 1.49967 10.1252 1.5 9.8499V2.8499C1.5 2.5749 1.598 2.3394 1.794 2.1434C1.99 1.9474 2.22533 1.84957 2.5 1.8499H6.9625L5.9625 2.8499H2.5V9.8499H9.5V6.3749L10.5 5.3749V9.8499C10.5 10.1249 10.402 10.3604 10.206 10.5564C10.01 10.7524 9.77467 10.8502 9.5 10.8499H2.5ZM8.0875 2.1374L8.8 2.8374L5.5 6.1374V6.8499H6.2L9.5125 3.5374L10.225 4.2374L6.9125 7.5499C6.82083 7.64157 6.7145 7.71457 6.5935 7.7689C6.4725 7.82324 6.3455 7.85024 6.2125 7.8499H5C4.85833 7.8499 4.7395 7.8019 4.6435 7.7059C4.5475 7.6099 4.49967 7.49124 4.5 7.3499V6.1374C4.5 6.00407 4.525 5.8769 4.575 5.7559C4.625 5.6349 4.69583 5.52874 4.7875 5.4374L8.0875 2.1374ZM10.225 4.2374L8.0875 2.1374L9.3375 0.887402C9.5375 0.687402 9.77717 0.587402 10.0565 0.587402C10.3358 0.587402 10.5712 0.687402 10.7625 0.887402L11.4625 1.5999C11.6542 1.79157 11.75 2.0249 11.75 2.2999C11.75 2.5749 11.6542 2.80824 11.4625 2.9999L10.225 4.2374Z" />
                        </svg>
                    ),
                    eye: (
                        <svg width="18" height="18" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 4.5C6.39782 4.5 6.77936 4.65804 7.06066 4.93934C7.34196 5.22064 7.5 5.60218 7.5 6C7.5 6.39782 7.34196 6.77936 7.06066 7.06066C6.77936 7.34196 6.39782 7.5 6 7.5C5.60218 7.5 5.22064 7.34196 4.93934 7.06066C4.65804 6.77936 4.5 6.39782 4.5 6C4.5 5.60218 4.65804 5.22064 4.93934 4.93934C5.22064 4.65804 5.60218 4.5 6 4.5ZM6 2.25C8.5 2.25 10.635 3.805 11.5 6C10.635 8.195 8.5 9.75 6 9.75C3.5 9.75 1.365 8.195 0.5 6C1.365 3.805 3.5 2.25 6 2.25ZM1.59 6C1.99413 6.82515 2.62165 7.52037 3.40124 8.00663C4.18083 8.49288 5.0812 8.75066 6 8.75066C6.9188 8.75066 7.81917 8.49288 8.59876 8.00663C9.37835 7.52037 10.0059 6.82515 10.41 6C10.0059 5.17485 9.37835 4.47963 8.59876 3.99337C7.81917 3.50712 6.9188 3.24934 6 3.24934C5.0812 3.24934 4.18083 3.50712 3.40124 3.99337C2.62165 4.47963 1.99413 5.17485 1.59 6Z" />
                        </svg>
                    ),
                    'eye-slash': (
                        <FontAwesomeIcon icon={faEyeSlash} />
                    ),
                    trash: (
                        <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.19445 4.15008H10.7213C10.7213 3.68239 10.5355 3.23386 10.2048 2.90315C9.8741 2.57244 9.42556 2.38666 8.95787 2.38666C8.49018 2.38666 8.04165 2.57244 7.71094 2.90315C7.38024 3.23386 7.19445 3.68239 7.19445 4.15008ZM5.43102 4.15008C5.43102 3.2147 5.8026 2.31763 6.46401 1.65622C7.12543 0.994808 8.0225 0.62323 8.95787 0.62323C9.89325 0.62323 10.7903 0.994808 11.4517 1.65622C12.1131 2.31763 12.4847 3.2147 12.4847 4.15008H16.8933C17.1271 4.15008 17.3514 4.24298 17.5168 4.40833C17.6821 4.57368 17.775 4.79795 17.775 5.03179C17.775 5.26564 17.6821 5.48991 17.5168 5.65526C17.3514 5.82061 17.1271 5.91351 16.8933 5.91351H16.1156L15.3344 15.0304C15.2593 15.9108 14.8565 16.7309 14.2057 17.3285C13.5549 17.9261 12.7035 18.2576 11.8199 18.2575H6.09583C5.21228 18.2576 4.36087 17.9261 3.71005 17.3285C3.05924 16.7309 2.65643 15.9108 2.58133 15.0304L1.80013 5.91351H1.02246C0.788615 5.91351 0.564348 5.82061 0.398995 5.65526C0.233642 5.48991 0.140747 5.26564 0.140747 5.03179C0.140747 4.79795 0.233642 4.57368 0.398995 4.40833C0.564348 4.24298 0.788615 4.15008 1.02246 4.15008H5.43102ZM11.603 9.44036C11.603 9.20651 11.5101 8.98225 11.3448 8.81689C11.1794 8.65154 10.9551 8.55864 10.7213 8.55864C10.4875 8.55864 10.2632 8.65154 10.0978 8.81689C9.93248 8.98225 9.83959 9.20651 9.83959 9.44036V12.9672C9.83959 13.2011 9.93248 13.4253 10.0978 13.5907C10.2632 13.756 10.4875 13.8489 10.7213 13.8489C10.9551 13.8489 11.1794 13.756 11.3448 13.5907C11.5101 13.4253 11.603 13.2011 11.603 12.9672V9.44036ZM7.19445 8.55864C7.42829 8.55864 7.65256 8.65154 7.81791 8.81689C7.98327 8.98225 8.07616 9.20651 8.07616 9.44036V12.9672C8.07616 13.2011 7.98327 13.4253 7.81791 13.5907C7.65256 13.756 7.42829 13.8489 7.19445 13.8489C6.9606 13.8489 6.73634 13.756 6.57098 13.5907C6.40563 13.4253 6.31274 13.2011 6.31274 12.9672V9.44036C6.31274 9.20651 6.40563 8.98225 6.57098 8.81689C6.73634 8.65154 6.9606 8.55864 7.19445 8.55864ZM4.3377 14.8805C4.37526 15.3209 4.57679 15.731 4.90239 16.0298C5.22798 16.3287 5.6539 16.4943 6.09583 16.4941H11.8199C12.2615 16.4939 12.687 16.328 13.0122 16.0292C13.3375 15.7305 13.5387 15.3206 13.5763 14.8805L14.3451 5.91351H3.57061L4.3377 14.8805Z" fill="#322C2D" fillOpacity="0.8" />
                        </svg>
                    ),
                    floppy: (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.5 3.5V10C10.5 10.275 10.4022 10.5105 10.2065 10.7065C10.0105 10.9022 9.775 11 9.5 11H2.5C2.225 11 1.9895 10.9022 1.7935 10.7065C1.59783 10.5105 1.5 10.275 1.5 10L1.5 2C1.5 1.725 1.59783 1.4895 1.7935 1.2935C1.9895 1.09783 2.225 1 2.5 1H8.5L10.5 3.5ZM9.5 3.925L8.075 2H2.5V10H9.5V3.925ZM6 9C6.41667 9 6.77083 8.85417 7.0625 8.5625C7.35417 8.27083 7.5 7.91667 7.5 7.5C7.5 7.08333 7.35417 6.72917 7.0625 6.4375C6.77083 6.14583 6.41667 6 6 6C5.58333 6 5.22917 6.14583 4.9375 6.4375C4.64583 6.72917 4.5 7.08333 4.5 7.5C4.5 7.91667 4.64583 8.27083 4.9375 8.5625C5.22917 8.85417 5.58333 9 6 9ZM3 4.575H7.5V3.5H3V4.575ZM2.5 3.925V10V2V3.925Z" fill="#322C2D" />
                        </svg>
                    ),
                    crown: (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 20H20V22H4V20ZM21 5C20.7348 5 20.4804 5.10536 20.2929 5.29289C20.1054 5.48043 20 5.73478 20 6C20.0001 6.11372 20.0219 6.22638 20.064 6.332C20.1052 6.43414 20.1615 6.52953 20.231 6.615L18.111 8.307L15.994 10L14.24 6.927L12.488 3.855C12.6383 3.76966 12.7651 3.64837 12.857 3.502C12.9508 3.35139 13.0004 3.17743 13 3C13 2.73478 12.8946 2.48043 12.7071 2.29289C12.5196 2.10536 12.2652 2 12 2C11.7348 2 11.4804 2.10536 11.2929 2.29289C11.1054 2.48043 11 2.73478 11 3C10.9996 3.17743 11.0492 3.35139 11.143 3.502C11.2349 3.64835 11.3617 3.76963 11.512 3.855L9.757 6.927L8.002 10L5.886 8.308L3.769 6.615C3.83847 6.52953 3.89476 6.43414 3.936 6.332C3.97814 6.22638 3.99986 6.11372 4 6C4 5.80222 3.94135 5.60888 3.83147 5.44443C3.72159 5.27998 3.56541 5.15181 3.38268 5.07612C3.19996 5.00043 2.99889 4.98063 2.80491 5.01921C2.61093 5.0578 2.43275 5.15304 2.29289 5.29289C2.15304 5.43275 2.0578 5.61093 2.01922 5.80491C1.98063 5.99889 2.00043 6.19996 2.07612 6.38268C2.15181 6.56541 2.27998 6.72159 2.44443 6.83147C2.60888 6.94135 2.80222 7 3 7C3.01393 6.99962 3.02773 6.99726 3.041 6.993C3.0543 6.98831 3.06804 6.98496 3.082 6.983L3.541 12.492L4 18H20L20.459 12.492L20.918 6.983C20.9316 6.98503 20.945 6.98838 20.958 6.993C20.9716 6.99736 20.9857 6.99972 21 7C21.2652 7 21.5196 6.89464 21.7071 6.70711C21.8946 6.51957 22 6.26522 22 6C22 5.73478 21.8946 5.48043 21.7071 5.29289C21.5196 5.10536 21.2652 5 21 5Z" />
                        </svg>
                    ),
                    close: (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19.2919 17.3954C19.5438 17.6472 19.6853 17.9888 19.6853 18.345C19.6853 18.7012 19.5438 19.0428 19.2919 19.2946C19.0401 19.5465 18.6985 19.6879 18.3423 19.6879C17.9861 19.6879 17.6446 19.5465 17.3927 19.2946L10.2997 12.1993L3.20442 19.2924C2.95257 19.5442 2.61099 19.6857 2.25482 19.6857C1.89864 19.6857 1.55706 19.5442 1.30521 19.2924C1.05335 19.0405 0.911865 18.6989 0.911865 18.3428C0.911865 17.9866 1.05335 17.645 1.30521 17.3932L8.40046 10.3001L1.30744 3.20487C1.05559 2.95302 0.9141 2.61143 0.9141 2.25526C0.9141 1.89909 1.05559 1.5575 1.30744 1.30565C1.55929 1.0538 1.90088 0.912311 2.25705 0.912311C2.61322 0.912311 2.95481 1.0538 3.20666 1.30565L10.2997 8.40091L17.3949 1.30453C17.6468 1.05268 17.9884 0.911194 18.3445 0.911194C18.7007 0.911194 19.0423 1.05268 19.2942 1.30453C19.546 1.55639 19.6875 1.89797 19.6875 2.25414C19.6875 2.61032 19.546 2.9519 19.2942 3.20375L12.1989 10.3001L19.2919 17.3954Z" fill="#322C2D" fillOpacity="0.8" />
                        </svg>
                    ),
                    'check-circle-o': (
                        <svg width="85" height="85" viewBox="0 0 85 85" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_1_903)">
                                <path d="M61.8367 24.6367L65.5633 28.3633L34.55 59.3766L19.4367 44.2633L23.1633 40.5367L34.55 51.9234L61.8367 24.6367ZM42.5 0C46.3922 0 50.1464 0.496875 53.7625 1.49063C57.3787 2.48438 60.7602 3.90599 63.907 5.75547C67.0539 7.60495 69.9109 9.81328 72.4781 12.3805C75.0453 14.9477 77.2537 17.8185 79.1031 20.993C80.9526 24.1674 82.3742 27.549 83.368 31.1375C84.3617 34.726 84.8724 38.4802 84.9 42.4C84.9 46.2922 84.4031 50.0464 83.4094 53.6625C82.4156 57.2786 80.994 60.6602 79.1445 63.807C77.2951 66.9539 75.0867 69.8109 72.5195 72.3781C69.9524 74.9453 67.0815 77.1536 63.907 79.0031C60.7326 80.8526 57.3511 82.2742 53.7625 83.268C50.174 84.2617 46.4198 84.7724 42.5 84.8C38.6078 84.8 34.8537 84.3031 31.2375 83.3094C27.6214 82.3156 24.2399 80.894 21.093 79.0445C17.9461 77.1951 15.0891 74.9867 12.5219 72.4195C9.95469 69.8523 7.74636 66.9815 5.89688 63.807C4.0474 60.6326 2.62579 57.2648 1.63204 53.7039C0.638287 50.143 0.12761 46.375 0.100006 42.4C0.100006 38.5078 0.596881 34.7536 1.59063 31.1375C2.58438 27.5214 4.006 24.1398 5.85547 20.993C7.70495 17.8461 9.91329 14.9891 12.4805 12.4219C15.0477 9.85469 17.9185 7.64635 21.093 5.79688C24.2675 3.9474 27.6352 2.52578 31.1961 1.53203C34.757 0.538281 38.525 0.0276042 42.5 0ZM42.5 79.5C45.8953 79.5 49.1664 79.0583 52.3133 78.175C55.4602 77.2917 58.4138 76.0495 61.1742 74.4484C63.9346 72.8474 66.4466 70.9013 68.7102 68.6102C70.9737 66.319 72.906 63.8208 74.507 61.1156C76.1081 58.4104 77.3641 55.4568 78.275 52.2547C79.1859 49.0526 79.6276 45.7677 79.6 42.4C79.6 39.0047 79.1583 35.7336 78.275 32.5867C77.3917 29.4398 76.1495 26.4862 74.5484 23.7258C72.9474 20.9654 71.0013 18.4534 68.7102 16.1898C66.419 13.9263 63.9208 11.994 61.2156 10.393C58.5104 8.79193 55.5568 7.53594 52.3547 6.625C49.1526 5.71406 45.8677 5.2724 42.5 5.3C39.1047 5.3 35.8336 5.74167 32.6867 6.625C29.5399 7.50833 26.5862 8.75052 23.8258 10.3516C21.0654 11.9526 18.5534 13.8987 16.2899 16.1898C14.0263 18.481 12.094 20.9792 10.493 23.6844C8.89193 26.3896 7.63594 29.3432 6.72501 32.5453C5.81407 35.7474 5.3724 39.0323 5.40001 42.4C5.40001 45.7953 5.84167 49.0664 6.72501 52.2133C7.60834 55.3602 8.85053 58.3138 10.4516 61.0742C12.0526 63.8346 13.9987 66.3466 16.2899 68.6102C18.581 70.8737 21.0792 72.806 23.7844 74.407C26.4896 76.0081 29.4432 77.2641 32.6453 78.175C35.8474 79.0859 39.1323 79.5276 42.5 79.5Z" fill="#0D9500" />
                            </g>
                            <defs>
                                <clipPath id="clip0_1_903">
                                    <rect width="84.8" height="84.8" fill="white" transform="translate(0.100006)" />
                                </clipPath>
                            </defs>
                        </svg>
                    ),
                    upload: (
                        <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.2 10.6998H8V5.8998H11.2L5.6 0.299805L0 5.8998H3.2V10.6998ZM0 12.2998H11.2V13.8998H0V12.2998Z" fill="#2965AD" />
                        </svg>
                    ),
                    info: (
                        <FontAwesomeIcon icon={faInfoCircle} />
                    ),
                    search: (
                        <FontAwesomeIcon icon={faSearch} />
                    ),
                    'external-link': (
                        <FontAwesomeIcon icon={faExternalLink} />
                    ),
                    building: (
                        <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_10_14)">
                                <path d="M0.482143 18.75H1.28571V0.9375C1.28571 0.419727 1.71743 0 2.25 0H15.75C16.2826 0 16.7143 0.419727 16.7143 0.9375V18.75H17.5179C17.7841 18.75 18 18.9599 18 19.2188V20H2.38419e-07V19.2188C2.38419e-07 18.9599 0.21588 18.75 0.482143 18.75ZM12.8571 2.96875C12.8571 2.70988 12.6413 2.5 12.375 2.5H10.7679C10.5016 2.5 10.2857 2.70988 10.2857 2.96875V4.53125C10.2857 4.79012 10.5016 5 10.7679 5H12.375C12.6413 5 12.8571 4.79012 12.8571 4.53125V2.96875ZM12.8571 6.71875C12.8571 6.45988 12.6413 6.25 12.375 6.25H10.7679C10.5016 6.25 10.2857 6.45988 10.2857 6.71875V8.28125C10.2857 8.54012 10.5016 8.75 10.7679 8.75H12.375C12.6413 8.75 12.8571 8.54012 12.8571 8.28125V6.71875ZM10.7679 12.5H12.375C12.6413 12.5 12.8571 12.2901 12.8571 12.0312V10.4688C12.8571 10.2099 12.6413 10 12.375 10H10.7679C10.5016 10 10.2857 10.2099 10.2857 10.4688V12.0312C10.2857 12.2901 10.5016 12.5 10.7679 12.5ZM7.71429 18.75H10.2857V15.4688C10.2857 15.2099 10.0698 15 9.80357 15H8.19643C7.93017 15 7.71429 15.2099 7.71429 15.4688V18.75ZM5.14286 12.0312C5.14286 12.2901 5.35874 12.5 5.625 12.5H7.23214C7.49841 12.5 7.71429 12.2901 7.71429 12.0312V10.4688C7.71429 10.2099 7.49841 10 7.23214 10H5.625C5.35874 10 5.14286 10.2099 5.14286 10.4688V12.0312ZM5.14286 8.28125C5.14286 8.54012 5.35874 8.75 5.625 8.75H7.23214C7.49841 8.75 7.71429 8.54012 7.71429 8.28125V6.71875C7.71429 6.45988 7.49841 6.25 7.23214 6.25H5.625C5.35874 6.25 5.14286 6.45988 5.14286 6.71875V8.28125ZM5.14286 4.53125C5.14286 4.79012 5.35874 5 5.625 5H7.23214C7.49841 5 7.71429 4.79012 7.71429 4.53125V2.96875C7.71429 2.70988 7.49841 2.5 7.23214 2.5H5.625C5.35874 2.5 5.14286 2.70988 5.14286 2.96875V4.53125Z" />
                            </g>
                            <defs>
                                <clipPath id="clip0_10_14">
                                    <rect width="18" height="20" fill="white" transform="matrix(-1 0 0 1 18 0)" />
                                </clipPath>
                            </defs>
                        </svg>
                    ),
                    'notification': (
                        <svg width="36" height="29" viewBox="0 0 36 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.8 24.7563C11.7554 25.4799 13.017 25.9199 14.4 25.9199C15.783 25.9199 17.0446 25.4799 18 24.7563M4.28528 21.0326C3.7161 21.0326 3.3982 20.1848 3.7425 19.7138C4.54141 18.6208 5.31252 17.0177 5.31252 15.0873L5.34548 12.29C5.34548 7.09295 9.39932 2.87988 14.4 2.87988C19.4743 2.87988 23.5879 7.15501 23.5879 12.4286L23.5549 15.0873C23.5549 17.031 24.2994 18.6428 25.0659 19.7362C25.3969 20.2084 25.0782 21.0326 24.516 21.0326H4.28528Z" stroke="#322C2D" stroke-width="1.92" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    ),
                    'angle-left': (
                        <FontAwesomeIcon icon={faAngleLeft} />
                    ),
                    'angle-right': (
                        <FontAwesomeIcon icon={faAngleRight} />
                    ),
                    'angle-down': (
                        <FontAwesomeIcon icon={faAngleDown} />
                    ),
                    'angle-up': (
                        <FontAwesomeIcon icon={faAngleUp} />
                    ),
                    'double-left': (
                        <FontAwesomeIcon icon={faAngleDoubleLeft} />
                    ),
                    'double-right': (
                        <FontAwesomeIcon icon={faAngleDoubleRight} />
                    ),
                    'plus': (
                        <FontAwesomeIcon icon={faPlus} />
                    )
                }[name]}
            </span>
            {/* </OverlayTrigger> */}
        </>
    )
}

export default Icon;