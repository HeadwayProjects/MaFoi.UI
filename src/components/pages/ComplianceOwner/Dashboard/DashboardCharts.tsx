import React, { useState } from "react";
import ReactECharts from "echarts-for-react";

enum ChartCategory {
    DEPARTMENT = 'department',
    STATE = 'state',
    LOCATION = 'location',
    ENTITY = 'entity'
}

export default function DashboardCharts(props: any) {
    const [category, setCategory] = useState(ChartCategory.DEPARTMENT);

    function handleCateoryChange(event: any) {

    }

    const option = {
        title: {
            text: 'Log Axis',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c}'
        },
        legend: {
            bottom: 'bottom'
        },
        xAxis: {
            type: 'category',
            name: 'x',
            splitLine: { show: false },
            data: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        yAxis: {
            type: 'log',
            name: 'y',
            minorSplitLine: {
                show: true
            }
        },
        series: [
            {
                name: 'Log2',
                type: 'line',
                data: [1, 3, 9, 27, 81, 247, 741, 2223, 6669]
            },
            {
                name: 'Log3',
                type: 'line',
                data: [1, 2, 4, 8, 16, 32, 64, 128, 256]
            },
            {
                name: 'Log1/2',
                type: 'line',
                data: [
                    1 / 2,
                    1 / 4,
                    1 / 8,
                    1 / 16,
                    1 / 32,
                    1 / 64,
                    1 / 128,
                    1 / 256,
                    1 / 512
                ]
            }
        ]
    };

    return (
        <>
            <div className="d-flex flex-row px-4 justify-content-between rounded-3" style={{ backgroundColor: "var(--page-bg)" }}>
                <div className="form-check my-2" >
                    <input className="form-check-input" type="radio" name="frequency" checked={category === ChartCategory.DEPARTMENT}
                        id={ChartCategory.DEPARTMENT} onChange={handleCateoryChange} value={ChartCategory.DEPARTMENT} />
                    <label className="form-check-label" htmlFor={ChartCategory.DEPARTMENT}>{'Department'}</label>
                </div>
                <div className="form-check my-2" >
                    <input className="form-check-input" type="radio" name="frequency" checked={category === ChartCategory.STATE}
                        id={ChartCategory.STATE} onChange={handleCateoryChange} value={ChartCategory.STATE} />
                    <label className="form-check-label" htmlFor={ChartCategory.STATE}>{'State'}</label>
                </div>
                <div className="form-check my-2" >
                    <input className="form-check-input" type="radio" name="frequency" checked={category === ChartCategory.LOCATION}
                        id={ChartCategory.LOCATION} onChange={handleCateoryChange} value={ChartCategory.LOCATION} />
                    <label className="form-check-label" htmlFor={ChartCategory.LOCATION}>{'Location'}</label>
                </div>
                <div className="form-check my-2" >
                    <input className="form-check-input" type="radio" name="frequency" checked={category === ChartCategory.ENTITY}
                        id={ChartCategory.ENTITY} onChange={handleCateoryChange} value={ChartCategory.ENTITY} />
                    <label className="form-check-label" htmlFor={ChartCategory.ENTITY}>{'Entity'}</label>
                </div>
            </div>
            <div className="d-flex w-100">
                {
                    option && <ReactECharts option={option} />
                }
            </div>
        </>
    )
}