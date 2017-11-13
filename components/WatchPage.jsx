import React from "react";
import PropTypes from "prop-types";
import numeral from "numeral";
import moment from "moment";

import Navbar from "./Navbar.jsx";

class WatchPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {video: {}};
    }

    componentDidMount() {
        let id = this.props.match.params.id;

    }

    render() {
        return (
            <div>
                <Navbar dp={this.props.user ? this.props.user.dp : "http://localhost:8000/account_circle.png"} />
                <div style={{position: "absolute", top: "100px", width: "100%"}}>
                    <div style={{display: "flex"}}>
                        <div style={{display: "flex", flexDirection: "column", width: "62.5%", marginLeft: "3.75%"}}>
                            <video controls="true" preload="metadata" poster={this.state.video.thumbnail}
                                src={this.state.video.path}>
                            </video>
                        </div>
                        <div style={{display: "flex", flexDirection: "column", width: "30%", marginLeft: "3.75%"}}>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

WatchPage.propTypes = {
    match: PropTypes.object,
    user: PropTypes.object
};

export default WatchPage;
