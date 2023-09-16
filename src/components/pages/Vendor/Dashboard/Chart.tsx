import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { getCSSPropertyValue } from "../../../../utils/styles";
import { ACTIVITY_STATUS, AUDIT_STATUS, ActivityColorMappings } from "../../../common/Constants";

const CHART_MAPPING = [
    { color: ActivityColorMappings[AUDIT_STATUS.COMPLIANT], label: 'Compliant', key: 'compliant' },
    { color: ActivityColorMappings[AUDIT_STATUS.NON_COMPLIANCE], label: 'Non-Compliance', key: 'nonCompliant' },
    { color: ActivityColorMappings[AUDIT_STATUS.NOT_APPLICABLE], label: 'Not Applicable', key: 'notApplicable' },
    { color: ActivityColorMappings[ACTIVITY_STATUS.REJECTED], label: 'Rejected', key: 'rejected' },
    { color: '--dark-green', label: 'Audit', key: 'audit' },
    { color: '--orange', label: 'Physical Audit', key: 'physicalAudit' },
    { color: '--gray', label: 'No Audit', key: 'noAudit' }
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
                center: [275, '50%'],
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

    useEffect(() => {
        if (data) {
            const _data = keys.map((key: string) => {
                const _chart: any = CHART_MAPPING.find(x => x.key === key) || {};
                return {
                    value: data[key] || 0,
                    name: `${data[key] || 0} ${_chart.label}`,
                    itemStyle: {
                        color: getCSSPropertyValue(_chart.color) || _chart.color
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