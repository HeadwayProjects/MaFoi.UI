import { Link } from "raviger";
import React from "react";

function MastersLayout({ title, breadcrumbs, children }) {

    return (
        <div className="d-flex flex-column">
            <div className="d-flex  p-2 align-items-center pageHeading shadow">
                <h4 className="mb-0">{title}</h4>
                <div className="d-flex align-items-end h-100">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0 d-flex justify-content-end">
                            {
                                (breadcrumbs || []).map((breadcrumb, index) => (

                                    <li className={`breadcrumb-item ${index > 0 ? 'fw-bold' : ''}`} key={index}>
                                        {
                                            (breadcrumb.path || breadcrumb.action) ?
                                                <Link href={breadcrumb.path} onClick={breadcrumb.action}>{breadcrumb.label}</Link> :
                                                <>{breadcrumb.label}</>
                                        }
                                    </li>
                                ))
                            }
                        </ol>
                    </nav>
                </div>
            </div>
            <div>{children}</div>
        </div>
    )

}

export default MastersLayout;