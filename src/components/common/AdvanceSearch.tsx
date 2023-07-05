import React, { useState, useEffect } from "react";
import { FILTERS, SEARCH_FIELDS, TOOLTIP_DELAY } from "./Constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import AdvanceSearchModal from "./AdvanceSearchModal";
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Tooltip from 'react-bootstrap/Tooltip';

function AdvanceSearch({ payload, fields, onSubmit, downloadReport }: any) {
    const [showModal, setShowModal] = useState(false);
    const [label, setLabel] = useState<any>('');
    const [value, setValue] = useState('');
    const [filter, setFilter] = useState<any>();

    useEffect(() => {
        if (payload) {
            if (payload.month) {
                const filter: any = SEARCH_FIELDS.find(x => x.value === FILTERS.MONTH);
                if (filter) {
                    setLabel(filter.label);
                    setValue(`${payload.month} (${payload.year})`);
                    setFilter(FILTERS.MONTH);
                }
            } else {
                setLabel('');
                setValue('');
                setFilter(null);
            }
        } else {
            setLabel('');
            setValue('');
            setFilter(null);
        }
    }, [payload]);

    function CheckFilters() {
        let count = 0;
        ['fromDate', 'activityType', 'auditType'].forEach((key) => {
            if (!!payload[key]) {
                count++;
            }
        });

        return (
            <>
                {
                    count > 0 &&
                    <>(+{count})</>
                }
            </>
        )
    }

    return (
        <>
            <div className="d-flex justify-content-start h-100 align-items-end">
                <div className="d-flex align-items-end me-3">
                    <div className="d-flex flex-column">
                        <button type="submit" className="btn btn-primary d-flex align-items-center"
                            onClick={(e) => {
                                e.preventDefault();
                                setShowModal(true);
                            }}>
                            <FontAwesomeIcon icon={faSearch} />
                            <span className="ms-2">Advance Search <CheckFilters /></span>
                        </button>
                    </div>
                </div>
                {
                    label && filter &&
                    <div className="d-flex flex-column align-items-start">
                        <label className="filter-label"><small>{label}</small></label>
                        <div className="d-flex align-items-center border px-2 rounded" style={{ height: '38px' }}>
                            {
                                filter === FILTERS.MONTH && Boolean(downloadReport) ?
                                    <OverlayTrigger overlay={<Tooltip>Click to download report</Tooltip>}
                                        placement="bottom" delay={{ show: TOOLTIP_DELAY } as any}>
                                        <a href="/" onClick={downloadReport}>{value}</a>
                                    </OverlayTrigger>
                                    : <>{value}</>
                            }
                        </div>
                    </div>

                }

            </div>
            {
                showModal &&
                <AdvanceSearchModal fields={fields} data={payload}
                    onSubmit={onSubmit}
                    onCancel={() => { setShowModal(false) }} />
            }
        </>
    )
}

export default AdvanceSearch;