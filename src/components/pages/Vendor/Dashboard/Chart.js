import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";

const CHART_MAPPING = [
    { color: '#0D9500', label: 'Compliant', key: 'compliant' },
    { color: '#FF0000', label: 'Non-Compliant', key: 'nonCompliant' }
]
const defaultConfig = {
    tooltip: {
        trigger: 'item',
        formatter: "{b}"
    },
    legend: {
        orient: 'vertical',
        bottom: '10',
        left: "center",
        data: []
    },
    series: [
        {
            data: [],
            type: 'pie',
            radius: [20, '55%'],
            center: ['60%', '50%'],
            smooth: true,
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

function Chart({ data, keys }) {
    const [config, setConfig] = useState(null);

    useEffect(() => {
        if (data) {
            const _config = { ...defaultConfig };
            const _data = keys.map(key => {
                const _chart = CHART_MAPPING.find(x => x.key === key) || {};
                return {
                    value: data[key],
                    name: `${data[key]} ${_chart.label}`,
                    itemStyle: {
                        color: _chart.color
                    }
                }
            });
            const _legentData = keys.map(key => {
                const _chart = CHART_MAPPING.find(x => x.key === key) || {};
                return `${data[key]} ${_chart.label}`
            });
            const total = _data.reduce((n, { value }) => n + value, 0);
            _config.series[0].label.formatter = ({ value }) => {
                const _valueByTotal = value / total;
                if (_valueByTotal === NaN) return '0 %';
                return `${_valueByTotal * 100} %`;
            };
            _config.series[0].data = _data;
            _config.legend.data = _legentData;
            setConfig(_config);
        }
    }, [data]);

    return (
        <div className="d-flex flex-column">
            <div className="performance-chart">
                {
                    config && <ReactECharts option={config} />
                }
            </div>
        </div>
    )
}

export default Chart;