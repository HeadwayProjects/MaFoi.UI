import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import NavTabs from "../../../shared/NavTabs";
import { useGetComplianceStatusByCategory } from "../../../../backend/compliance";
import { DEFAULT_PAYLOAD } from "../../../common/Table";
import { setUserDetailsInFilters } from "../Compliance.constants";

enum ChartCategory {
    DEPARTMENT = 'department',
    STATE = 'state',
    LOCATION = 'location',
    ENTITY = 'associateCompany'
}

const colors = ['#A9D18E', '#FFC000', '#FF2D2D'];

const list = [
    { value: ChartCategory.DEPARTMENT, label: 'Department' },
    { value: ChartCategory.STATE, label: 'State' },
    { value: ChartCategory.LOCATION, label: 'Location' },
    { value: ChartCategory.ENTITY, label: 'Entity' },
]

const Status: any = {
    'On Time': 'OnTime',
    'Late Closure': 'Late',
    'Non-Compliance': 'NonCompliance'
}

export default function DashboardCharts({ filters }: any) {
    const [category, setCategory] = useState(ChartCategory.DEPARTMENT);
    const [payload, setPayload] = useState<any>({ ...DEFAULT_PAYLOAD, pagination: null, filters: setUserDetailsInFilters([], true) });
    const [options, setOptions] = useState<any>(null);
    const { response, isFetching } = useGetComplianceStatusByCategory(category, payload);

    const [defaultOption] = useState<any>({
        color: colors,
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        legend: {
            data: ['On Time', 'Late Closure', 'Non-Compliance']
        },
        xAxis: [
            {
                type: 'category',
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: 'On Time',
                position: 'left',
                alignTicks: true,
                nameRotate: 90,
                nameLocation: 'center',
                nameGap: 50,
                axisLine: {
                    show: true
                },
                axisLabel: {
                    formatter: '{value}'
                }
            },
            {
                type: 'value',
                name: 'Late Closure, Non-Compliance',
                position: 'right',
                alignTicks: true,
                nameRotate: 270,
                nameLocation: 'center',
                nameGap: 20,
                axisLine: {
                    show: true
                },
                axisTick: {
                    show: true
                },
                axisLabel: {
                    formatter: '{value}'
                }
            }
        ],
        dataset: {
            source: [
            ]
        },
        series: [
            {
                seriesLayoutBy: 'row',
                type: 'bar',
                barMaxWidth: 20
            },
            {
                type: 'line',
                smooth: true,
                seriesLayoutBy: 'row',
                emphasis: { focus: 'series' }
            },
            {
                type: 'line',
                smooth: true,
                seriesLayoutBy: 'row',
                emphasis: { focus: 'series' }
            }
        ]
    });

    function handleCategoryChange(event: any) {
        setCategory(event);
    }

    useEffect(() => {
        if (filters) {
            const _filters = [...filters];
            setUserDetailsInFilters(_filters, true);
            setPayload({ ...payload, filters: _filters });
        }
    }, [filters]);

    useEffect(() => {
        if (!isFetching && response) {
            const source = [[category], ['On Time'], ['Late Closure'], ['Non-Compliance']];
            const groups = ['', 'On Time', 'Late Closure', 'Non-Compliance'];
            const _options = JSON.parse(JSON.stringify(defaultOption));
            response.forEach((group: any) => {
                source[0].push(group.name);
                groups.forEach((x: string, i: number) => {
                    if (Boolean(x)) {
                        const index = group.values.findIndex((a: any) => a.name === Status[x]);
                        if (index === -1) {
                            source[i].push(0 as any);
                        } else {
                            source[i].push(group.values[index].value)
                        }
                    }
                })
            });
            _options.dataset.source = source;
            setOptions(_options);
        }
    }, [isFetching])

    return (
        <>
            <div className="mb-2 text-appprimary text-xl fw-bold">Compliance Status by Category</div>
            <NavTabs list={list} onTabChange={handleCategoryChange} />
            <div className="w-100 mt-2">
                {
                    options && <ReactECharts option={options} />
                }
            </div>
        </>
    )
}