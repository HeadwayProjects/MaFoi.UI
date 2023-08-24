import React, { useEffect, useState, useRef } from "react";
import ReactECharts from "echarts-for-react";
import { ComplianceChartStatus, ComplianceChartStatusMapping } from "../Compliance.constants";

const defaultConfig = {
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
            data: [],
            type: 'pie',
            center: ['50%', '50%'],
            smooth: true,
            radius: ['40%', '70%'],
            height: 250,
            label: {
                show: true,
                position: 'inner'
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

export default function ComplianceStatusChart1({ data, fields }: any) {
    const [config, setConfig] = useState<any>(null);
    const chartRef = useRef<any>();
    chartRef.current = null;

    useEffect(() => {
        if (Object.keys(data || {}).length) {
            console.log(fields);
            const _config: any = { ...defaultConfig };
            const _data = fields.map((key: ComplianceChartStatus) => {
                const _chart: any = ComplianceChartStatusMapping[key];
                return {
                    value: data[key],
                    name: `${data[key]} ${_chart.label}`,
                    itemStyle: {
                        color: _chart.color
                    }
                }
            });
            const total = _data.reduce((n: any, { value }: any) => n + value, 0);
            _config.series[0].label.formatter = ({ value }: any) => {
                const _valueByTotal = value / total;
                if (isNaN(_valueByTotal)) return '0 %';
                const _percentageValue = _valueByTotal * 100;
                return `${Math.round(_percentageValue)} %`;
            };
            _config.series[0].data = _data;
            setConfig(_config);
        }
    }, [data]);
    return (
        <div className="d-block" ref={chartRef}>
            {
                config && <ReactECharts option={config} />
            }
        </div>
    )
}