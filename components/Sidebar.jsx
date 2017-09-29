import React from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";

class Sidebar extends React.Component {
    /*
        props:
            dp: A base64 encoding of an image.
            name: The organization's name.
    */
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ul className="side-nav fixed center" style={{transform: "translateX(0%)"}}>
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
                <li style={{paddingTop: "50px"}}>
                    <Link to="/">
                        <i className="material-icons">help</i>
                        Help
                    </Link>
                </li>
                <li>
                    <Link to="/">
                        <i className="material-icons">settings</i>
                        Settings
                    </Link>
                </li>
                <li>
                    <Link to="/">
                        <i className="material-icons">feedback</i>
                        Feedback
                    </Link>
                </li>
                <li>
                    <a href="#">
                        <i className="material-icons">exit_to_app</i>
                        Log Out
                    </a>
                </li>
            </ul>
        );
    }
}

Sidebar.propTypes = {
    dp: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
};

export default Sidebar;
