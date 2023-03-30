import React, { Component } from "react";
import '../shared/PageLoader.css';

class PageLoader extends Component {
    constructor(props) {
        super(props);
        this.state = { message: 'Please wait...' };
    }

    componentDidMount() {
        window.document.body.style.overflow = 'hidden';
    }

    componentWillUnmount() {
        window.document.body.style.overflow = 'auto';
    }

    componentWillReceiveProps({ message }) {
        this.setState({ message: message || 'Please wait...' })
    }

    render() {
        return (
            <div className="pageload-overlay">
                <div className="pageload-container">
                    <div className="spinner-border text-primary" role="status">
                    </div>
                    <p className="mt-2 mb-0">{this.state.message}</p>
                </div>
            </div>
        )
    }
}

export default PageLoader;