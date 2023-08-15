import React, { useEffect, useState } from "react";
import { PAGES_CONFIGURATION, USER_PRIVILEGES } from "./RoleConfiguration";
import styles from "./Roles.module.css";
import { preventDefault } from "../../../../utils/common";
import { Link } from "raviger";
import { Button } from "react-bootstrap";
import { VIEWS } from "./Roles";
import { API_DELIMITER, API_RESULT } from "../../../../utils/constants";
import { useCreateRole, useUpdateRole } from "../../../../backend/users";
import PageLoader from "../../../shared/PageLoader";
import { toast } from "react-toastify";

export default function AddEditPrivileges({ role, changeView }: any) {
    const [mappings] = useState(PAGES_CONFIGURATION);
    const [selected, setSelected] = useState<any>({});
    const { createRole, creating } = useCreateRole(({ key, value }: any) => {
        if (key === API_RESULT.SUCCESS) {
            toast.success(value);
            changeView(VIEWS.LIST);
        } else {
            toast.error(value);
        }
    }, (error: any) => {
        console.log(error);
    });
    const { updateRole, updating } = useUpdateRole(({ key, value }: any) => {
        if (key === API_RESULT.SUCCESS) {
            toast.success(value);
            changeView(VIEWS.LIST);
        } else {
            toast.error(value);
        }
    }, (error: any) => {
        console.log(error);
    });

    function backToRoles(event?: any) {
        preventDefault(event);
        changeView(VIEWS.LIST);
    }

    function handleChange(event: any) {
        const name = event.target.name;
        const checked = event.target.checked;
        setSelected({ ...selected, [name]: checked });
    }

    function handleRadioChange(event: any, mapping: any) {
        const name = event.target.value;
        const selection = { ...selected };
        mapping.privileges.forEach((x: any) => {
            const { id, actions = [] } = x;
            delete selection[id];
            actions.forEach(({ id }: any) => {
                delete selection[id];
            });
        });
        setSelected({ ...selection, [name]: true });
    }

    function handleSelection(event: any, mapping: any, checked = true) {
        preventDefault(event);
        const selection: any = {};
        mapping.privileges.forEach((x: any) => {
            selection[x.id] = checked;
        });
        setSelected({ ...selected, ...selection });
    }

    function clearSelection(event: any, mapping: any) {
        preventDefault(event);
        const selection = { ...selected };
        mapping.privileges.forEach((x: any) => {
            delete selection[x.id];
        });
        setSelected({ ...selection });
    }

    function getSelected() {
        const keys = Object.keys(selected);
        return keys.filter((key: string) => !!selected[key]);
    }

    function handleSubmit() {
        const privileges = getSelected().sort().join(API_DELIMITER);
        const request = { ...role, privileges };
        if (request.id) {
            updateRole(request);
        } else {
            createRole(request);
        }
    }

    function getActionOptions(mapping: any) {
        const privilege = mapping.privileges.find((x: any) => selected[x.id]);
        if (((privilege || {}).actions || []).length) {
            return (
                <>
                    <div className="d-flex flex-row align-items-center mb-1">
                        <div className="fw-semibold fs-6 text-appprimary">Actions</div>
                    </div>
                    <div className={styles.privilegesList}>
                        {
                            privilege.actions.map((action: any) => {
                                return (
                                    <div className="form-check" key={action.id}>
                                        <input type="checkbox" id={action.id}
                                            className="form-check-input"
                                            name={action.id}
                                            checked={selected[action.id]}
                                            onChange={handleChange} />
                                        <label title={action.name} htmlFor={action.id} className={`form-check-label ${styles.label}`}>{action.name}</label>
                                    </div>
                                )
                            })
                        }
                    </div>
                </>
            )
        }
        return (<></>)
    }

    useEffect(() => {
        if (role) {
            if (role.privileges) {
                const _selected: any = {};
                const _validKeys: string[] = Object.values(USER_PRIVILEGES);
                console.log(role.privileges);
                role.privileges.split(API_DELIMITER).forEach((key: string) => {
                    if (_validKeys.includes(key)) _selected[key] = true
                });
                setSelected(_selected);
            }
        }
    }, [role]);

    return (
        <>
            <div className="d-flex flex-column h-full position-relative">
                <nav aria-label="breadcrumb">
                    <ol className={`breadcrumb d-flex justify-content-start my-3 px-2 ${styles.breadcrumb}`}>
                        <li className="breadcrumb-item ">
                            <Link href="/" onClick={backToRoles} className="fw-bold">Roles</Link>
                        </li>
                        <li className="breadcrumb-item">
                            <div className="d-flex align-items-center">
                                <span className="fw-bold">{(role || {}).name}</span>
                                {/* <Icon name="pencil" className="ms-3" /> */}
                            </div>
                        </li>
                    </ol>
                </nav>
            </div>
            <div className="card border-0 p-4 m-4 mt-0">
                <div className={`d-flex flex-column h-100 justify-space-between`}>
                    <label className="fw-bold">Description</label>
                    <div className="d-flex align-items-start">
                        <p>{(role || {}).description || '-NA-'}</p>
                        {/* <Icon name="pencil" className="ms-3" /> */}
                    </div>
                    <form>
                        {
                            (mappings || []).map((mapping: any) => {
                                return (
                                    <div className={`card shadow p-3 ${styles.privilegesCard}`} key={mapping.id}>
                                        {
                                            mapping.isMulti &&
                                            <>
                                                <div className="d-flex flex-row justify-content-between align-items-center mb-2">
                                                    <div className="fw-semibold fs-5 text-appprimary">{mapping.name}</div>
                                                    <div className="d-flex flex-row align-items-center">
                                                        <a href="/" className="text-sm" onClick={(event) => handleSelection(event, mapping, true)}>Select All</a>
                                                        <span className="mx-2">|</span>
                                                        <a href="/" className="text-sm" onClick={(event) => handleSelection(event, mapping, false)}>Un-Select All</a>
                                                    </div>
                                                </div>
                                                <div className={styles.privilegesList}>
                                                    {
                                                        mapping.privileges.map((privilege: any) => {
                                                            return (
                                                                <div className="form-check" key={privilege.id}>
                                                                    <input type="checkbox" id={privilege.id}
                                                                        className="form-check-input"
                                                                        name={privilege.id}
                                                                        checked={selected[privilege.id]}
                                                                        onChange={handleChange} />
                                                                    <label title={privilege.name} htmlFor={privilege.id} className={`form-check-label ${styles.label}`}>{privilege.name}</label>
                                                                </div>

                                                            )
                                                        })
                                                    }
                                                </div>
                                            </>
                                        }
                                        {
                                            !mapping.isMulti &&
                                            <>
                                                <div className="d-flex flex-row justify-content-between align-items-center mb-2">
                                                    <div className="fw-semibold fs-5 text-appprimary">{mapping.name}</div>
                                                    <a href="/" className="text-sm" onClick={(event) => clearSelection(event, mapping)}>Clear</a>
                                                </div>
                                                <div className={styles.privilegesList}>
                                                    {
                                                        mapping.privileges.map((privilege: any) => {
                                                            return (
                                                                <div className="form-check" key={privilege.id}>
                                                                    <input type="radio" id={privilege.id}
                                                                        className="form-check-input"
                                                                        name={mapping.id}
                                                                        value={privilege.id}
                                                                        checked={selected[privilege.id]}
                                                                        onChange={(event) => handleRadioChange(event, mapping)} />
                                                                    <label title={privilege.name} htmlFor={privilege.id} className={`form-check-label ${styles.label}`}>{privilege.name}</label>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                <>{getActionOptions(mapping)}</>
                                            </>
                                        }
                                    </div>
                                )
                            })
                        }
                    </form>
                    <div className="d-flex justify-content-between mt-4">
                        <Button variant="outline-secondary" className="btn btn-outline-secondary px-4" onClick={backToRoles}>{'Back to List'}</Button>
                        <Button variant="primary" onClick={handleSubmit} className="px-4" disabled={getSelected().length == 0}>{'Save'}</Button>
                    </div>
                </div>
            </div>
            {creating && <PageLoader message={"Creating Role..."} />}
            {updating && <PageLoader message={"Updating Role..."} />}
        </>
    )
}