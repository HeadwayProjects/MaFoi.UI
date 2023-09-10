import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";

const CHART_MAPPING = [
    { color: '#4EC343', label: 'Compliant', key: 'compliant' },
    { color: '#FFC000', label: 'Non-Compliance', key: 'nonCompliant' },
    { color: '#5B5657', label: 'Not Applicable', key: 'notApplicable' },
    { color: '#FF2D2D', label: 'Rejected', key: 'rejected' },
];

function Chart({ data, keys }: any) {
    const [series, setSeries] = useState<any>([])

    const config = {
        tooltip: {
            trigger: 'item',
            formatter: "{b}"
        },
        legend: {
            top: 32,
            left: 20,
            orient: 'vertical',
            icon: 'circle'
        },
        series: [
            {
                data: series,
                type: 'pie',
                center: [250, '50%'],
                smooth: true,
                radius: ['30%', '70%'],
                height: 250,
                label: {
                    show: true,
                    position: 'inner',
                    formatter: ({percent}: any) => {
                        return `${Math.round(percent)}%`
                    }
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            },
        ]
    };

    useEffect(() => {
        if (data) {
            const _data = keys.map((key: string) => {
                const _chart: any = CHART_MAPPING.find(x => x.key === key) || {};
                return {
                    value: data[key] || 0,
                    name: `${data[key] || 0} ${_chart.label}`,
                    itemStyle: {
                        color: _chart.color
                    }
                }
            });
            setSeries(_data);
        }
    }, [data]);

    return (
        <div className="d-block">
            <ReactECharts option={config} lazyUpdate={true} opts={{ renderer: 'canvas' }} />
        </div>
    )
}

export default Chart;