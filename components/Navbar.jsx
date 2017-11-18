/* eslint-disable no-undef */
import React from "react";
import PropTypes from "prop-types";

import {Link, Redirect} from "react-router-dom";

class Navbar extends React.Component {
    /*
        props:
            dp: base64 encoded image string
    */
    constructor(props) {
        super(props);
        this.state = {search: false};
        this.search = this.search.bind(this);
    }

    search() {
        this.setState({search: true});
    }

    render() {
        if (this.state.search)
            return (
                <Redirect to={"/search/" + $("#search").val()} />
            );
        return (
            <div style={{zIndex: 1000, position: "fixed", width: "100%", height: "64px"}} className="green lighten-1 row">
                <div className="col s3">
                    <Link to="/">
                        <p href="#" style={{bottom: "25px", fontSize: "32px", fontWeight: "lighter",
                            position: "relative", color: "white"}}>OpenVideo</p>
                    </Link>
                </div>
                <div className="col s6">
                    <form id="search-bar" style={{position: "absolute", width: "600px", height: "70%"}}>
                        <input id="search" placeholder="Search" type="text" className="no-material search-bar" />
                        <i className="material-icons" onClick={this.search} style={{position: "fixed", marginRight: "10px", paddingTop: "10px"}}>search</i>
                    </form>
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
