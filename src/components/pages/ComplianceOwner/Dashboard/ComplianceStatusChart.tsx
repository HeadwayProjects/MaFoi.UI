import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { ComplianceChartStatus, ComplianceChartStatusMapping } from "../../../../constants/Compliance.constants";
import { getCSSPropertyValue } from "../../../../utils/styles";

export default function ComplianceStatusChart({ data, fields, type }: any) {
    const [series, setSeries] = useState<any>([])

    useEffect(() => {
        if (Object.keys(data || {}).length) {
            const _data = fields.map((key: ComplianceChartStatus) => {
                const _chart: any = ComplianceChartStatusMapping[key];
                return {
                    value: data[key],
                    name: `${data[key]} ${_chart.label}`,
                    itemStyle: {
                        color: getCSSPropertyValue(_chart.color) || _chart.color
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
            top: 32,
            left: 20,
            orient: 'vertical',
            icon: 'circle'
        },
        series: [
            {
                data: series,
                type: 'pie',
                center: [type === 'col1' ? 260 : 200, '50%'],
                smooth: true,
                radius: ['30%', '70%'],
                height: 250,
                label: {
                    show: true,
                    position: 'inner',
                    formatter: ({ percent }: any) => {
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
    return (
        <div className="d-block">
            <ReactECharts option={config} lazyUpdate={true} opts={{ renderer: 'canvas' }} />
        </div>
    )
}