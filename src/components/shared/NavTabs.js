import React, { Component } from "react";
import "./NavTabs.css";

export class NavTabs extends Component {

    tabs = [];

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        this.tabs = this.props.list || [];
        const selectedTab = ((this.props.list || [])[0] || {}).value;
        this.setState({ selectedTab });
    }

    onTabSelect(tab) {
        if (tab !== this.state.selectedTab) {
            this.setState({ selectedTab: tab });
            this.props.onTabChange(tab);
        }
    }

    render() {
        return (
            <div className="row">
                {this.props.children}
                <div className="nav-tabs-rounded mx-auto p-1 w-auto">
                    <ul className="nav nav-tabs border-0 d-flex justify-content-center" role="tablist">
                        {
                            this.tabs.map(tab => {
                                return (
                                    <li className="nav-item" key={tab.value}>
                                        <button id={tab.value} role="tab" onClick={() => this.onTabSelect(tab.value)}
                                            className={`nav-link d-flex flex-column align-items-center nav-buttons ${this.state.selectedTab === tab.value ? 'active' : ''}`}
                                            data-bs-toggle="tab" aria-selected="true">
                                            {
                                                typeof tab.label === 'string' ?
                                                    <span>{tab.label}</span> :
                                                    <>
                                                        {
                                                            tab.label.map(label => <span key={label} className="lh-1">{label}</span>)
                                                        }
                                                    </>
                                            }
                                        </button>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
        )
    }
}

export default NavTabs;