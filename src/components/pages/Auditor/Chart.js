import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import "./AuditorModule.css";

const CHART_MAPPING = [
    { color: '#0D9500', label: 'Audited', key: 'audited' },
    { color: '#FF0000', label: 'Not-Audited', key: 'notAudited' }
]
const defaultConfig = {
    series: [
        {
            data: [],
            type: 'pie',
            smooth: true,
            height: 250,
            label: {
                show: true,
                position: 'inner',
                formatter: '{c}'
            }
        },
    ]
};

function Chart({ data, keys }) {
    const [config, setConfig] = useState(null);
    const [legends, setLegends] = useState([]);

    useEffect(() => {
        if (Object.keys(data || {}).length) {
            const _legends = [];
            const _data = keys.map(key => {
                const _chart = CHART_MAPPING.find(x => x.key === key) || {};
                _legends.push({ color: _chart.color, value: data[key], label: _chart.label, key });
                return {
                    value: data[key],
                    label: _chart.label,
                    itemStyle: {
                        color: _chart.color
                    }
                }
            });
            const _config = { ...defaultConfig };
            _config.series[0].data = _data;
            setConfig(_config);
            setLegends(_legends);
        }
    }, [data]);

    return (
        <div className="d-flex flex-column">
            <div className="performance-chart">
                {
                    config && <ReactECharts option={config} />
                }
            </div>
            <div className="performance-chart-legends d-flex flex-row w-100 justify-content-center">
                <div className="col-4">
                    {
                        config && legends.map(legend => {
                            return (
                                <div className="d-flex fs-6 align-items-center mb-1" key={legend.key}>
                                    <span className="legend-marker" style={{ background: `${legend.color}` }}>{ }</span>
                                    <small className="ms-2 me-1 fw-bold">{legend.value}</small>
                                    <small>{legend.label}</small>
                                </div>
                            )
                        })
                    }

                </div>
            </div>
        </div>
    )
}

export default Chart;