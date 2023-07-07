import React, { useEffect, useState } from "react";
import styles from "./NavTabs.module.css";

function NavTabs({ list = [], onTabChange, children }: any) {
    const [tabs, setTabs] = useState();
    const [selectedTab, setSelectedTab] = useState(list[0].value || '')

    function onTabSelect(tab: string) {
        if (tab !== selectedTab) {
            setSelectedTab(tab);
            onTabChange(tab);
        }
    }

    useEffect(() => {
        if ((list || []).length > 0){
            setTabs(list);
        }
    }, [list])

    return (
        <div className="row">
            {children}
            <div className="nav-tabs-rounded mx-auto p-1 w-auto">
                <ul className="nav nav-tabs border-0 d-flex justify-content-center" role="tablist">
                    {
                        (tabs || []).map((tab: any) => {
                            return (
                                <li className="nav-item" key={tab.value}>
                                    <button id={tab.value} role="tab" onClick={() => onTabSelect(tab.value)}
                                        className={`nav-link d-flex flex-column align-items-center ${styles.navButtons} ${selectedTab === tab.value ? 'active' : ''}`}
                                        data-bs-toggle="tab" aria-selected="true">
                                        {
                                            typeof tab.label === 'string' ?
                                                <span>{tab.label}</span> :
                                                <>
                                                    {
                                                        tab.label.map((label: any) => <span key={label} className="lh-1">{label}</span>)
                                                    }
                                                </>
                                        }
                                    </button>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </div>
    )
}

export default NavTabs;