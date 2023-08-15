import React, { useEffect, useState } from "react";
import { PAGES_CONFIGURATION } from "./RoleConfiguration";
import styles from "./Roles.module.css";
import { API_DELIMITER } from "../../../../utils/constants";

export default function ViewPrivileges({ privileges, fullView = true }: any) {
    const [mappings, setMappings] = useState<any[]>([]);

    useEffect(() => {
        if (privileges) {
            const _mappings: any = [];
            const userPrivileges = (privileges || '').split(API_DELIMITER);
            PAGES_CONFIGURATION.forEach((page: any) => {
                const _privilegesCopy: any[] = [];
                page.privileges.forEach((privilege: any) => {
                    if (userPrivileges.includes(privilege.id)) {
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
                fullView && mappings.map((page: any) => {
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
            {
                !fullView && <div className="mt-2">
                    {
                        mappings.map((page: any) => {
                            return (
                                <span className={styles.chips} key={page.id}>{page.name}</span>
                            )
                        })
                    }
                </div>
            }
        </div>
    )

}