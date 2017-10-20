import React from "react";
import PropTypes from "prop-types";

import {Link} from "react-router-dom";

class Navbar extends React.Component {
    /*
        props:
            dp: base64 encoded image string
    */
    render() {
        return (
            <div style={{zIndex: 1000, position: "fixed", width: "100%", height: "64px"}} className="green lighten-1 row">
                <div className="col s3">
                    <Link to="/">
                        <h5 href="#" style={{top: "5px", position: "relative", color: "white"}}><b>QTube</b></h5>
                    </Link>
                </div>
                <div className="col s6">
                    <div className="card" style={{position: "absolute", width: "600px", height: "70%"}}>
                        <input id="search" placeholder="Search" className="no-material search-bar" />
                        <i className="material-icons" style={{position: "fixed", marginRight: "10px", paddingTop: "10px"}}>search</i>
                    </div>
                </div>
                <div className="col s3" style={{direction: "rtl"}}>
                    <img src={this.props.dp ? this.props.dp : "http://localhost:8000/account_circle.png"} className="round nav-dp nav-element" />
                </div>
            </div>
        );
    }
}

Navbar.propTypes = {
    dp: PropTypes.string
};

export default Navbar;
