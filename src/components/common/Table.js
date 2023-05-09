import React, { useEffect, useRef, useState } from "react";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import ReactDOM from 'react-dom/client';
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Tooltip from 'react-bootstrap/Tooltip';
import "./Table.css";
import { TOOLTIP_DELAY } from "./Constants";

export function reactFormatter(JSX, JSXElementConstructor) {
    return function customFormatter(cell, formatterParams, onRendered) {
        const cellEle = cell.getElement();
        const root = ReactDOM.createRoot(cellEle);

        function renderFn() {
            if (cellEle) {
                const CompWithProps = React.cloneElement(JSX || JSXElementConstructor(cell), { cell });
                root.render(CompWithProps);
            }
        }
        onRendered(renderFn);
        setTimeout(() => {
            renderFn();
        }, 0);
        return '';
    }
}

export function TitleTmpl({ cell }) {
    const _def = cell.getColumn().getDefinition();
    return (
        <div className="ellipse two-lines">{_def.title}</div>
    )
}

export function CellTmpl({ cell }) {
    const value = cell.getValue();
    return (
        <>
            {
                !!value &&
                <OverlayTrigger overlay={<Tooltip>{value}</Tooltip>}
                    placement="bottom" delay={{ show: TOOLTIP_DELAY }}>
                    <div className="d-flex align-items-center h-100">
                        <div className="ellipse two-lines">{value}</div>
                    </div>
                </OverlayTrigger>
            }
        </>
    )
}

function Table(props) {
    const id = `table_${new Date().getTime()}`;
    const divEle = useRef(null);
    const {
        height = 500,
        paginationMode,
        ajaxURL = '-',
        ajaxConfig,
        ajaxRequestFunc,
        columns,
        initialSort,
        layout = 'fitColumns',
        selectable = true,
        selectableCheck = () => {
            return true;
        },
        resizableColumnFit = true,
        sortMode = 'local',
        paginationSize = 1000,
        rowHeight = 24,
        bufferSpacing = 20
    } = props.options;

    const [table, setTable] = useState();
    const [tableColumns, setTableColumns] = useState([]);
    const [pageCounter, setPageCounter] = useState('No records');

    function handleResize() {
        if (divEle && divEle.current) {
            const { y } = divEle.current.getBoundingClientRect();
            const ht = `calc(${window.innerHeight - y - 25}px - ${bufferSpacing || 0}px)`;
            divEle.current.style.height = ht;
        }
    }

    function updatePageCounter(total) {
        setPageCounter(total ? `Showing 1 - ${total} of ${total} records` : 'No records');
    }

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        handleResize();
    });

    useEffect(() => {
        if (columns) {
            setTableColumns(columns);
        }
    }, [columns]);


    useEffect(() => {
        if (tableColumns) {
            const _table = new Tabulator(divEle.current, {
                height: height + 10,
                pagination: true,
                paginationMode,
                paginationSize,
                ajaxURL,
                ajaxConfig,
                ajaxRequestFunc,
                sortMode,
                selectable,
                selectableCheck,
                // dataLoaderLoading
                placeholder: 'No Data Available',
                ajaxResponse: (url, params, response) => {
                    return response;
                },
                initialSort,
                layout,
                columns: tableColumns,
                resizableColumnFit,
                rowHeight
            });
            setTable(_table);

            _table.on('tableBuilt', () => {
                // _table.element.querySelector('.tablulator-footer').style.display = 'none';
            });

            _table.on('dataLoaded', (data) => {
                setTimeout(() => {
                    const _placeholder = _table.element.querySelector('tabulator-placeholder-contents');
                    if ((data || []).length === 0 && _placeholder) {
                        _placeholder.style.display = 'inline-block';
                    }
                }, 100);
            });
            _table.on("rowClick", function (e, row) {
                if (props.onSelectionChange) {
                    const selectedData = _table.getSelectedData();
                    props.onSelectionChange(selectedData);
                }
            });

        }

        return () => {
            const _div = divEle.current;
            if (!!_div) {
                while (_div.firstChild) {
                    _div.removeChild(_div.firstChild);
                }
            }
        }
    }, [tableColumns]);

    useEffect(() => {
        if (props.data && table) {
            // const _page = (props.data || {}).page || 1;
            // const _lastPage = (props.data || {}).last_page || 1;
            // const _total = (props.data || {}).total || 0;
            // setPage(_page);
            // setLastPage(_lastPage);
            if (table.replaceData && (table.rowManager || {}).renderer) {
                try {
                    table.replaceData((props.data || {}).data || []);
                    if (((props.data || {}).data || []).length === 0) {
                        table.rowManager._showPlaceholder();
                    }
                    updatePageCounter(((props.data || {}).data || []).length);
                } catch (e) {
                    console.error(e);
                }
            }
            setTimeout(() => {
                table.redraw();
            }, 100);
        }
    }, [props.data]);


    useEffect(() => {
        if (typeof props.isLoading !== 'undefined' && !!table) {
            setTimeout(() => {
                if (props.isLoading) {
                    table.rowManager._clearPlaceholder();
                    table.alertManager.alert(table.options.dataLoaderLoading);
                } else {
                    try {
                        const _alert = table.element.querySelector('.tabulator-alert');
                        table.element.removeChild(_alert);
                    } catch (e) {
                        console.error('Error removing alerts', e);
                    }
                    table.alertManager.clear();
                }
            });
        }
    }, [props.isLoading]);

    return (
        <>
            <div style={{ position: 'relative' }}>
                <div style={{ minHeight: '200px' }}
                    id={id}
                    ref={divEle}
                    className="tabulator-sticky"></div>
                {/* <Pagination /> */}
                <div className="custom-tabulator-footer">{pageCounter}</div>
            </div>
        </>
    )
}

export default Table;