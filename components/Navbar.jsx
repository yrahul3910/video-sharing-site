import React from "react";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";

class Navbar extends React.Component {
    /*
        props:
            dp: base64 encoded image string
    */
    render() {
        return (
            <div style={{zIndex: 1000, position: "fixed", width: "100%", height: "64px"}} className="green lighten-1 row">
                <div className="col s3">
                    <h3 href="#" style={{bottom: "15px", position: "relative", color: "white"}}>QTube</h3>
                </div>
                <div className="col s6">
                    <div className="card" style={{position: "absolute", width: "600px", height: "80%"}}>
                        <input id="search" placeholder="Search" className="no-material search-bar" />
                        <i className="material-icons" style={{position: "fixed", marginRight: "10px", paddingTop: "15px"}}>search</i>
                    </div>
                </div>
                <div className="col s3" style={{direction: "rtl"}}>
                    <img src={this.props.dp} className="round nav-dp nav-element" />
                    <i className="material-icons nav-element white-text" style={{bottom: "8px", position: "relative"}}>file_upload</i>
                </div>
            </div>
        );
    }
}

Navbar.propTypes = {
    dp: PropTypes.string.isRequired
};

export default Navbar;
