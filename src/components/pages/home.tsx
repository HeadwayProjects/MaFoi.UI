import React, { useState } from "react";
import {
    useGetActivities, useGetActs, useGetCities,
    useGetLaws, useGetRules,
    useGetStates, useGetRuleMappings
} from "../../backend/masters";
import { DEFAULT_DASHBOARD_PAYLOAD } from "../common/Table";
import styles from "./home.module.css";
import { useEffect } from "react";
import { isUndefined } from "underscore";
import { humanReadableNumber } from "../../utils/common";
import { Button } from "react-bootstrap";
import { navigate } from "raviger";
import { getBasePath } from "../../App";

const EZYCOMP_HIGHLIGHTS = [
    { label: 'Total Law Categories', key: 'laws', url: 'masters/law' },
    { label: 'Total States', key: 'states', url: 'masters/state' },
    { label: 'Total Cities', key: 'cities', url: 'masters/city' },
    { label: 'Total Acts', key: 'acts', url: 'masters/Act' },
    { label: 'Total Rules', key: 'rules', url: 'masters/rule' },
    { label: 'Total Activities', key: 'activities', url: 'masters/activity' },
    { label: 'Rule-Activies Mapped', key: 'activitiesMapped', url: 'masters/mapping' }
]

function Home() {
    const [t] = useState(new Date().getTime());
    const [ezycompHighlights, setEzycompHighlights] = useState<any>({});
    const { total: laws } = useGetLaws({ ...DEFAULT_DASHBOARD_PAYLOAD, t });
    const { total: states } = useGetStates({ ...DEFAULT_DASHBOARD_PAYLOAD, t });
    const { total: cities } = useGetCities({ ...DEFAULT_DASHBOARD_PAYLOAD, t });
    const { total: acts } = useGetActs({ ...DEFAULT_DASHBOARD_PAYLOAD, t });
    const { total: rules } = useGetRules({ ...DEFAULT_DASHBOARD_PAYLOAD, t });
    const { total: activities } = useGetActivities({ ...DEFAULT_DASHBOARD_PAYLOAD, t });
    const { total: activitiesMapped } = useGetRuleMappings({ ...DEFAULT_DASHBOARD_PAYLOAD, t });

    function navigateToPage(path: string) {
        navigate(`${getBasePath()}/${path}`);
    }

    useEffect(() => {
        if (!isUndefined(laws) && !isUndefined(states) && !isUndefined(cities)
            && !isUndefined(acts) && !isUndefined(rules) && !isUndefined(activities)
            && !isUndefined(activitiesMapped)) {
            setEzycompHighlights({
                ...ezycompHighlights,
                laws,
                states,
                cities,
                acts,
                rules,
                activities,
                activitiesMapped
            })
        }

    }, [laws, states, cities, acts, rules, activities, activitiesMapped])

    return (
        <>
            <div style={{ paddingBottom: '44px', minHeight: '100%' }} className="d-flex flex-column bg-dashboard">
                <div className="d-flex mb-4 p-2 align-items-center pageHeading shadow">
                    <h4 className="mb-0">Home</h4>
                </div>
                <div className="d-flex flex-row my-4 mx-3 card shadow p-4">
                    <div className="col-12">
                        <div className="">
                            <div className="card-header bg-white border-0 underline text-appprimary fw-semibold fs-5 d-flex align-items-center">
                                <div className="mx-2">Ezycomp Highlights</div>
                            </div>
                            <div className="card-body pt-3">
                                <div className={styles.cardsContainer}>
                                    {
                                        EZYCOMP_HIGHLIGHTS.map(item => {
                                            return (
                                                <Button className={`btn btn-primary card  border-0 p-2 ${styles.cardCount} ${styles[item.key]}`} key={item.key}
                                                    onClick={() => navigateToPage(item.url)}>
                                                    <div className="card-body py-1 w-100">
                                                        <div className="row d-flex flex-column align-items-center justify-content-between h-100 fw-bold">
                                                            <label className="text-center px-3 text-md">{item.label}</label>
                                                            <div className="text-lg text-center">{humanReadableNumber(ezycompHighlights[item.key] || 0)}</div>
                                                        </div>
                                                    </div>
                                                </Button>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home;