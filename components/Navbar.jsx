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
        this.state = {search: 0, q: ""};
        this.search = this.search.bind(this);
        this.change = this.change.bind(this);
    }

    change() {
        if ($(".search-input").val())
            this.setState({q: $(".search-input").val()});
    }

    search() {
        window.location = "/#/search/" + this.state.q;
        window.location.reload();
    }

    render() {
        return (
            <div style={{zIndex: 1000, position: "fixed", width: "100%", height: "64px"}} className="green lighten-1 row">
                <div className="col s3">
                    <Link to="/">
                        <p href="#" style={{bottom: "25px", fontSize: "32px", fontWeight: "lighter",
                            position: "relative", color: "white"}}>OpenVideo</p>
                    </Link>
                </div>
                <div className="col s6">
                    <form className="search-bar" style={{position: "absolute", width: "600px", height: "70%"}}>
                        <input onChange={this.change} placeholder="Search" type="text" className="no-material search-input search" />
                        <i className="link material-icons" onClick={this.search}
                            style={{position: "fixed", marginRight: "10px", paddingTop: "10px", color: "lightgray"}}>
                            search
                        </i>
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
