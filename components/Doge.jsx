import React from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";

import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";

class Doge extends React.Component {
    render() {
        return (
            <div>
                <Navbar dp={this.props.user ? this.props.user.dp : "http://localhost:8000/account_circle.png"} />
                <Sidebar toggleLogin={this.props.toggleLogin} loggedIn={this.props.user ? true : false} />
                <div style={{position: "absolute", marginLeft: "350px", top: "100px"}}>
                    <div>
                        <img src="/doge.jpg" style={{width: "400px", height: "225px"}} />
                    </div>
                    <div>
                        <p>
                            It seems you haven&#39;t subscribed to any users yet. Why not head over to the
                            <Link to="/trending"> trending page</Link> to find some inspiration?
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

Doge.propTypes = {
    user: PropTypes.object,
    toggleLogin: PropTypes.func.isRequired
};

export default Doge;
