import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import NavTabs from "../../../shared/NavTabs";

enum ChartCategory {
    DEPARTMENT = 'department',
    STATE = 'state',
    LOCATION = 'location',
    ENTITY = 'entity'
}

const data = {
    [ChartCategory.DEPARTMENT]: [
        {
            name: 'Accounts',
            activities: [{
                name: 'On Time',
                value: 10
            }, {
                name: 'Late Closure',
                value: 15
            }, {
                name: 'Non-Compliance',
                value: 2
            }]
        },
        {
            name: 'Payroll',
            activities: [{
                name: 'On Time',
                value: 5
            }, {
                name: 'Late Closure',
                value: 1
            }, {
                name: 'Non-Compliance',
                value: 0
            }]
        }
    ],
    [ChartCategory.STATE]: [
        {
            name: 'Tamil Nadu',
            activities: [{
                name: 'On Time',
                value: 25
            }, {
                name: 'Late Closure',
                value: 1
            }, {
                name: 'Non-Compliance',
                value: 5
            }]
        },
        {
            name: 'Telanagana',
            activities: [{
                name: 'On Time',
                value: 100
            }, {
                name: 'Late Closure',
                value: 8
            }, {
                name: 'Non-Compliance',
                value: 20
            }]
        }
    ],
    [ChartCategory.LOCATION]: [
        {
            name: 'Anna Nagar - TN',
            activities: [{
                name: 'On Time',
                value: 9
            }, {
                name: 'Late Closure',
                value: 0
            }, {
                name: 'Non-Compliance',
                value: 2
            }]
        },
        {
            name: 'Chennai - TN',
            activities: [{
                name: 'On Time',
                value: 14
            }, {
                name: 'Late Closure',
                value: 1
            }, {
                name: 'Non-Compliance',
                value: 3
            }]
        },
        {
            name: 'Hyderabad - TS',
            activities: [{
                name: 'On Time',
                value: 90
            }, {
                name: 'Late Closure',
                value: 4
            }, {
                name: 'Non-Compliance',
                value: 8
            }]
        },
        {
            name: 'Ammerpet - TS',
            activities: [{
                name: 'On Time',
                value: 10
            }, {
                name: 'Late Closure',
                value: 4
            }, {
                name: 'Non-Compliance',
                value: 12
            }]
        }
    ],
    [ChartCategory.ENTITY]: [
        {
            name: 'Cream Stone Ice cream Concepts',
            activities: [{
                name: 'On Time',
                value: 200
            }, {
                name: 'Late Closure',
                value: 5
            }, {
                name: 'Non-Compliance',
                value: 9
            }]
        }
    ]
}

const colors = ['#A9D18E', '#FFC000', '#FF2D2D'];

const list = [
    { value: ChartCategory.DEPARTMENT, label: 'Department' },
    { value: ChartCategory.STATE, label: 'State' },
    { value: ChartCategory.LOCATION, label: 'Location' },
    { value: ChartCategory.ENTITY, label: 'Entity' },
]

export default function DashboardCharts(props: any) {
    const [category, setCategory] = useState(ChartCategory.DEPARTMENT);
    const [options, setOptions] = useState<any>(null);

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
        // setCategory(event.target.value);
        setCategory(event);
    }

    useEffect(() => {
        if (category) {
            const _data: any = data[category];
            console.log(_data)
            const _options = JSON.parse(JSON.stringify(defaultOption));
            const source = [[category], ['On Time'], ['Late Closure'], ['Non-Compliance']];
            const groups = ['', 'On Time', 'Late Closure', 'Non-Compliance'];
            _data.forEach((group: any) => {
                source[0].push(group.name);
                groups.forEach((x: string, i: number) => {
                    if (Boolean(x)) {
                        const index = group.activities.findIndex((a: any) => a.name === x);
                        if (index === -1) {
                            source[i].push(0 as any);
                        } else {
                            source[i].push(group.activities[index].value)
                        }
                    }
                })
            });
            _options.dataset.source = source;
            setOptions(_options);
        }
    }, [category]);

    return (
        <>
            {/* <div className="d-flex flex-column px-4 justify-content-between rounded-3" style={{ backgroundColor: "var(--page-bg)" }}>
                <div className="form-check my-2" >
                    <input className="form-check-input" type="radio" name="frequency" checked={category === ChartCategory.DEPARTMENT}
                        id={ChartCategory.DEPARTMENT} onChange={handleCategoryChange} value={ChartCategory.DEPARTMENT} />
                    <label className="form-check-label" htmlFor={ChartCategory.DEPARTMENT}>{'Department'}</label>
                </div>
                <div className="form-check my-2" >
                    <input className="form-check-input" type="radio" name="frequency" checked={category === ChartCategory.STATE}
                        id={ChartCategory.STATE} onChange={handleCategoryChange} value={ChartCategory.STATE} />
                    <label className="form-check-label" htmlFor={ChartCategory.STATE}>{'State'}</label>
                </div>
                <div className="form-check my-2" >
                    <input className="form-check-input" type="radio" name="frequency" checked={category === ChartCategory.LOCATION}
                        id={ChartCategory.LOCATION} onChange={handleCategoryChange} value={ChartCategory.LOCATION} />
                    <label className="form-check-label" htmlFor={ChartCategory.LOCATION}>{'Location'}</label>
                </div>
                <div className="form-check my-2" >
                    <input className="form-check-input" type="radio" name="frequency" checked={category === ChartCategory.ENTITY}
                        id={ChartCategory.ENTITY} onChange={handleCategoryChange} value={ChartCategory.ENTITY} />
                    <label className="form-check-label" htmlFor={ChartCategory.ENTITY}>{'Entity'}</label>
                </div>
            </div> */}
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