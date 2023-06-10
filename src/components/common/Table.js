import React, { useEffect, useRef, useState } from "react";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import ReactDOM from 'react-dom/client';
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Tooltip from 'react-bootstrap/Tooltip';
import "./Table.css";
import { TOOLTIP_DELAY } from "./Constants";
import Icon from "./Icon";
import Select from "react-select";
import '../shared/PageLoader.css';
import PageLoader from "../shared/PageLoader";

const PageNav = {
    FIRST: 'first',
    PREVIOUS: 'previous',
    NEXT: 'next',
    LAST: 'last'
}

const DEFAULT_PAGE_SIZE = 50;
const PAGE_OPTIONS = [
    { value: 10, label: 10 },
    { value: 25, label: 25 },
    { value: 50, label: 50 },
    { value: 100, label: 100 },
]

export const DEFAULT_PAYLOAD = {
    pagination: {
        pageSize: DEFAULT_PAGE_SIZE,
        pageNumber: 1
    },
    filters: [],
    search: ''
}

export const DEFAULT_OPTIONS_PAYLOAD = {
    pagination: {
        pageSize: 5000,
        pageNumber: 1
    },
    filters: [],
    search: '',
    sort: { columnName: 'name', order: 'asc' }
}

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
                <div className="d-flex align-items-center h-100 w-auto">
                    <OverlayTrigger overlay={<Tooltip>{value}</Tooltip>} rootClose={true}
                        placement="bottom" delay={{ show: TOOLTIP_DELAY }}>
                        <div className="ellipse two-lines">{value}</div>
                    </OverlayTrigger>
                </div>
            }
        </>
    )
}

export function NameTmpl({ cell }) {
    const value = (cell.getValue() || {}).name;
    return (
        <>
            {
                !!value &&
                <div className="d-flex align-items-center h-100 w-auto">
                    <OverlayTrigger overlay={<Tooltip>{value}</Tooltip>} rootClose={true}
                        placement="bottom" delay={{ show: TOOLTIP_DELAY }}>
                        <div className="ellipse two-lines">{value}</div>
                    </OverlayTrigger>
                </div>
            }
        </>
    )
}

function Table(props) {
    const id = `table_${new Date().getTime()}`;
    const divEle = useRef(null);
    const {
        height = 500,
        paginationMode = 'remote',
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
        sortMode = 'remote',
        paginationSize = DEFAULT_PAGE_SIZE,
        rowHeight = 24,
        bufferSpacing = 1,
        paginate = false,
        rowFormatter
    } = props.options;

    const [table, setTable] = useState();
    const [tableColumns, setTableColumns] = useState([]);
    const [pageCounter, setPageCounter] = useState('No records');
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [pageSize, setPageSize] = useState({ value: paginationSize, label: paginationSize });

    function handleResize() {
        if (divEle && divEle.current) {
            const { y } = divEle.current.getBoundingClientRect();
            const ht = `calc(${window.innerHeight - y}px - ${bufferSpacing || 0}px)`;
            divEle.current.style.height = ht;
        }
    }

    function updatePageCounter(total) {
        const startIndex = (page - 1) * pageSize.value + 1;
        const lastIndex = page * pageSize.value;
        setPageCounter(total ? `Showing ${startIndex} - ${lastIndex > total ? total : lastIndex} of ${total} records` : 'No records');
    }

    function handlePageNav(pageNav) {
        let _page = 1;
        switch (pageNav) {
            case PageNav.FIRST:
                _page = 1;
                break;
            case PageNav.PREVIOUS:
                _page = page - 1;
                break;
            case PageNav.NEXT:
                _page = page + 1;
                break;
            case PageNav.LAST:
                _page = lastPage * 1;
                break;
            default:
                break;
        }
        setPage(_page);
        if (props.onPageNav) {
            props.onPageNav({ pageNumber: _page, pageSize: pageSize.value });
        }
    }

    function handlePageSizeChange(e) {
        setPageSize(e);
        setPage(1);
        table.setPageSize(e.value)
        if (props.onPageNav) {
            props.onPageNav({ pageNumber: 1, pageSize: e.value });
        }
    }

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        handleResize();
    });

    useEffect(() => {
        if (columns) {
            let _columns = [...columns];
            if (selectable) {
                _columns = [
                    {
                        formatter: "rowSelection", titleFormatter: "rowSelection",
                        hozAlign: "center", headerSort: false, width: 40
                    },
                    ..._columns
                ]
            }
            setTableColumns(_columns);
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
                placeholder: 'No Data Available',
                ajaxResponse: (url, params, response) => {
                    return response;
                },
                initialSort,
                layout,
                columns: tableColumns,
                resizableColumnFit,
                rowHeight,
                rowFormatter,
                dataLoader: false
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
            _table.on("rowSelectionChanged", props.onSelectionChange)

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
            const _page = (props.data || {}).page || 1;
            const _lastPage = (props.data || {}).last_page || 1;
            const _total = (props.data || {}).total || 0;
            setPage(_page);
            setLastPage(_lastPage);
            if (table.replaceData && (table.rowManager || {}).renderer) {
                try {
                    table.replaceData((props.data || {}).data || []);
                    const length = ((props.data || {}).data || []).length
                    if (length === 0) {
                        table.rowManager._showPlaceholder();
                    }
                    updatePageCounter(_total || length);
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
                <div className="custom-tabulator-footer d-flex justify-content-between align-items-center w-100">
                    <span>{pageCounter}</span>
                    {
                        paginate &&
                        <div className="d-flex align-items-center">
                            <Select options={PAGE_OPTIONS} value={pageSize} onChange={handlePageSizeChange}
                                placement="top" menuPosition="fixed" className="me-3 page-changer"
                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999, color: "var(--black-600)" }) }} />
                            <Icon name={'double-left'} className={'page-nav-btns'} type="button"
                                action={() => handlePageNav(PageNav.FIRST)} text={'First'}
                                disabled={page < 2} />
                            <Icon name={'angle-left'} className={'page-nav-btns'} type="button"
                                action={() => handlePageNav(PageNav.PREVIOUS)} text={'Previous'}
                                disabled={page < 2} />
                            <Icon name={'angle-right'} className={'page-nav-btns'} type="button"
                                action={() => handlePageNav(PageNav.NEXT)} text={'Next'}
                                disabled={page >= lastPage} />
                            <Icon name={'double-right'} className={'page-nav-btns'} type="button"
                                action={() => handlePageNav(PageNav.LAST)} text={'Last'}
                                disabled={page >= lastPage} />
                        </div>
                    }
                </div>
            </div>
            {
                props.isLoading && <PageLoader message={'Loading...'} />
            }
        </>
    )
}

export default Table;