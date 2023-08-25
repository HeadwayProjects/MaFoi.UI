import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { ComplianceChartStatus, ComplianceChartStatusMapping } from "../Compliance.constants";

export default function ComplianceStatusChart({ data, fields }: any) {
    const [series, setSeries] = useState<any>([])

    function formatter({ value, total }: any) {
        const _valueByTotal = value / total;
        if (isNaN(_valueByTotal)) return '0 %';
        const _percentageValue = _valueByTotal * 100;
        return `${Math.round(_percentageValue)} %`;
    }

    useEffect(() => {
        if (Object.keys(data || {}).length) {
            const total = fields.reduce((n: any, { key }: any) => n + data[key], 0);
            const _data = fields.map((key: ComplianceChartStatus) => {
                const _chart: any = ComplianceChartStatusMapping[key];
                return {
                    value: data[key],
                    total,
                    name: `${data[key]} ${_chart.label}`,
                    itemStyle: {
                        color: _chart.color
                    }
                }
            });
            setSeries(_data);
        }
    }, [data]);

    const config = {
        tooltip: {
            trigger: 'item',
            formatter: "{b}"
        },
        legend: {
            top: '12%',
            left: 20,
            orient: 'vertical'
        },
        series: [
            {
                data: series,
                type: 'pie',
                center: ['50%', '50%'],
                smooth: true,
                radius: ['40%', '70%'],
                height: 250,
                label: {
                    show: true,
                    position: 'inner',
                    formatter
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
    return (
        <div className="d-block">
            <ReactECharts option={config} lazyUpdate={true} opts={{ renderer: 'canvas' }} />
        </div>
    )
}