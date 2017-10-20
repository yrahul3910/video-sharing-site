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
                        <Link to="/">
                            <i className="material-icons">settings</i>
                            Settings
                        </Link>
                    </li>
                    <li>
                        <Link to="/feedback">
                            <i className="material-icons">feedback</i>
                            Feedback
                        </Link>
                    </li>
                </div>
            ) : <div></div>;

        let uploadLink = this.props.loggedIn ? (
            <li>
                <Link to="/upload">
                    <i className="material-icons">file_upload</i>
                    Upload
                </Link>
            </li>
        ) : <div></div>;

        return (
            <ul className="side-nav fixed center" style={{backgroundColor: "#f5f5f5", transform: "translateX(0%)"}}>
                <li style={{paddingTop: "100px"}}>
                    <Link to="/">
                        <i className="material-icons">home</i>
                        Home
                    </Link>
                </li>
                <li>
                    <Link to="/">
                        <i className="material-icons">add_circle</i>
                        Browse Channels
                    </Link>
                </li>
                <li>
                    <Link to="/">
                        <i className="material-icons">trending_up</i>
                        Trending
                    </Link>
                </li>
                {uploadLink}
                <li style={{paddingTop: "50px"}}>
                    <Link to="/">
                        <i className="material-icons">help</i>
                        Help
                    </Link>
                </li>
                {userElements}
                <li>
                    <Link to="/login">
                        <img style={{float: "left", display: "inline-block", marginTop: "10px"}}
                            src={"http://localhost:8000/" + (this.props.loggedIn ? "logout.png" : "login.png")} />
                        <span onClick={this.logout} style={{marginLeft: "20px"}}>Log {this.props.loggedIn ? "Out" : "In"}</span>
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
