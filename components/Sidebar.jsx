import React from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
    }

    logout() {
        if (this.props.loggedIn) {
            localStorage.removeItem("token");
            this.props.toggleLogin(null);
        }
    }

    render() {
        // Elements only shown to users that are logged in.
        let userElements = this.props.loggedIn ?
            (
                <div>
                    <li>
                        <Link to="/me">
                            <i className="material-icons">settings</i>
                            <span className="sidebar-item">Settings</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/feedback">
                            <i className="material-icons">feedback</i>
                            <span className="sidebar-item">Feedback</span>
                        </Link>
                    </li>
                </div>
            ) : <div></div>;

        let uploadLink = this.props.loggedIn ? (
            <li>
                <Link to="/upload">
                    <i className="material-icons">file_upload</i>
                    <span className="sidebar-item">Upload</span>
                </Link>
            </li>
        ) : <div></div>;

        return (
            <ul className="side-nav fixed" style={{backgroundColor: "#f5f5f5", transform: "translateX(0%)"}}>
                <li style={{paddingTop: "100px"}}>
                    <Link to="/">
                        <i className="material-icons">home</i>
                        <span className="sidebar-item">Home</span>
                    </Link>
                </li>
                <li>
                    <Link to="/trending">
                        <i className="material-icons">trending_up</i>
                        <span className="sidebar-item">Trending</span>
                    </Link>
                </li>
                {uploadLink}
                {userElements}
                <li>
                    <Link to="/login" onClick={this.logout}>
                        <img style={{float: "left", display: "inline-block", marginTop: "10px"}}
                            src={"http://localhost:8000/" + (this.props.loggedIn ? "logout.png" : "login.png")} />
                        <span style={{marginLeft: "80px"}}>Log {this.props.loggedIn ? "Out" : "In"}</span>
                    </Link>
                </li>
            </ul>
        );
    }
}

Sidebar.propTypes = {
    loggedIn: PropTypes.bool.isRequired,
    toggleLogin: PropTypes.func.isRequired
};

export default Sidebar;
