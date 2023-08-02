import React, { useEffect, useState } from "react";
import { PAGES_CONFIGURATION } from "./RoleConfiguration";
import styles from "./Roles.module.css";
import { API_DELIMITER } from "../../../../utils/constants";

export default function ViewPrivileges({ privileges, onSubmit, onEdit }: any) {
    const [mappings, setMappings] = useState<any[]>([]);

    useEffect(() => {
        if (privileges) {
            // const privileges: any[] = pages.split(API_DELIMITER);
            const _privileges: any[] = 'LAW_CATEGORY_VIEW;ACTS_VIEW;ACTIVITIES_VIEW;RULES_VIEW;STATE_VIEW;CITY_VIEW;RULE_COMPLIANCE_VIEW;MAPPING_VIEW;VIEW_COMPANIES;VIEW_ASSOCIATE_COMPANY;VIEW_LOCATION_MAPPING;AUDIT_SCHEDULE;VIEW_USERS;VIEW_COMPANY_MAPPING;VIEW_EMAIL_TEMPLATES'.split(API_DELIMITER);
            const _mappings: any = [];
            PAGES_CONFIGURATION.forEach((page: any) => {
                const _privilegesCopy: any[] = [];
                page.privileges.forEach((privilege: any) => {
                    if (_privileges.includes(privilege.id)) {
                        _privilegesCopy.push(privilege);
                    }
                });
                if (_privilegesCopy.length > 0) {
                    _mappings.push({
                        ...page,
                        privileges: _privilegesCopy
                    })
                }
            });
            setMappings(_mappings);
        }
    }, [privileges]);
    return (
        <div className="d-flex flex-column" style={{ marginTop: '-0.8rem' }}>
            {
                mappings.map((page: any) => {
                    return (
                        <div className="d-flex flex-column mb-1" key={page.id}>
                            <div className="fw-bold text-md">{page.name}</div>
                            <div className="">
                                {
                                    page.privileges.map((privilege: any) => {
                                        return (
                                            <span className={styles.chips} key={privilege.id}>{privilege.name}</span>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )

}