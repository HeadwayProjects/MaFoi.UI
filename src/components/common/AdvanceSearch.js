import React, { useState, useEffect } from "react";
import { FILTERS, SEARCH_FIELDS } from "./Constants";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import AdvanceSearchModal from "./AdvanceSearchModal";

function AdvanceSearch({ payload, fields, onSubmit }) {
    const [showModal, setShowModal] = useState(false);
    const [label, setLabel] = useState('');
    const [filter, setFilter] = useState('');

    useEffect(() => {
        if (payload) {
            if (payload.month) {
                const filter = SEARCH_FIELDS.find(x => x.value === FILTERS.MONTH);
                setLabel(filter.label);
                setFilter(`${payload.month} (${payload.year})`);
            } else if (payload.fromDate) {
                const filter = SEARCH_FIELDS.find(x => x.value !== FILTERS.MONTH && fields.includes(x.value));
                setLabel(filter.label);
                setFilter(`${dayjs(new Date(payload.fromDate)).format('DD/MM/YYYY')} -  ${dayjs(new Date(payload.toDate || payload.fromDate)).format('DD/MM/YYYY')}`);
            } else {
                setLabel('');
                setFilter('');
            }
        } else {
            setLabel('');
            setFilter('');
        }
    }, [payload]);

    return (
        <>
            <div className="d-flex justify-content-end h-100 align-items-end">
                {
                    label && filter &&
                    <div className="d-flex flex-column me-2 h-100">
                        <label className="filter-label"><small>{label}</small></label>
                        <div className="d-flex h-100 align-items-center">{filter}</div>
                    </div>

                }
                <div className="d-flex align-items-end ms-3">
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