import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";

const CHART_MAPPING = [
    { color: '#4EC343', label: 'Compliant', key: 'compliant' },
    { color: '#FFC000', label: 'Non-Compliance', key: 'nonCompliant' },
    { color: '#5B5657', label: 'Not Applicable', key: 'notApplicable' },
    { color: '#FF2D2D', label: 'Rejected', key: 'rejected' },
]
const defaultConfig = {
    tooltip: {
        trigger: 'item',
        formatter: "{b}"
    },
    series: [
        {
            data: [],
            type: 'pie',
            radius: [20, '80%'],
            center: ['50%', '50%'],
            smooth: true,
            height: 200,
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

function Chart({ data, keys }) {
    const [config, setConfig] = useState(null);
    const [legends, setLegends] = useState([])

    useEffect(() => {
        if (data) {
            const _config = { ...defaultConfig };
            const _data = keys.map(key => {
                const _chart = CHART_MAPPING.find(x => x.key === key) || {};
                return {
                    value: data[key] || 0,
                    name: `${data[key] || 0} ${_chart.label}`,
                    itemStyle: {
                        color: _chart.color
                    }
                }
            });
            setLegends(keys.map(key => {
                const _chart = CHART_MAPPING.find(x => x.key === key) || {};
                return {
                    key,
                    color: _chart.color,
                    label: `${data[key] || 0} ${_chart.label}`
                }
            }));
            const total = _data.reduce((n, { value }) => n + value, 0);
            _config.series[0].label.formatter = ({ value }) => {
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
        <div className="d-flex flex-row align-items-center justify-content-start">
            <div className="performance-chart col-6">
                {
                    config && <ReactECharts option={config} />
                }
            </div>
            <div className="performance-chart col-6 d-flex flex-column justify-content-center">
                {
                    (legends || []).length > 0 &&
                    legends.map(x => {
                        return (
                            <div className="d-flex flex-row align-items-center mb-1" key={x.key}>
                                <span className="legend-marker" style={{ background: x.color }}></span>
                                <div className="ms-2 text-md">{x.label}</div>
                            </div>
                        )
                    })
                }
            </div>

        </div>
    )
}

export default Chart;