import React, { useState, useEffect } from "react";
import { FILTERS, SEARCH_FIELDS, TOOLTIP_DELAY } from "./Constants";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import AdvanceSearchModal from "./AdvanceSearchModal";
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Tooltip from 'react-bootstrap/Tooltip';

function AdvanceSearch({ payload, fields, onSubmit, downloadReport }) {
    const [showModal, setShowModal] = useState(false);
    const [label, setLabel] = useState('');
    const [value, setValue] = useState('');
    const [filter, setFilter] = useState();

    useEffect(() => {
        if (payload) {
            if (payload.month) {
                const filter = SEARCH_FIELDS.find(x => x.value === FILTERS.MONTH);
                setLabel(filter.label);
                setValue(`${payload.month} (${payload.year})`);
                setFilter(FILTERS.MONTH);
            } else if (payload.fromDate) {
                const filter = SEARCH_FIELDS.find(x => x.value !== FILTERS.MONTH && fields.includes(x.value));
                setLabel(filter.label);
                setValue(`${dayjs(new Date(payload.fromDate)).format('DD/MM/YYYY')} -  ${dayjs(new Date(payload.toDate || payload.fromDate)).format('DD/MM/YYYY')}`);
                setFilter(filter.value);
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
                            <span className="ms-2">Advance Search</span>
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
                                        placement="bottom" delay={{ show: TOOLTIP_DELAY }}>
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