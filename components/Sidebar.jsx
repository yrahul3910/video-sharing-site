import React from "react";
import {Link} from "react-router-dom";

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
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

export default Sidebar;
