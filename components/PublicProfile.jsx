import React from "react";
import PropTypes from "prop-types";

import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";

class PublicProfile extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Navbar dp={this.props.user ? this.props.user.dp : "http://localhost:8000/account_circle.png"} />
                <Sidebar toggleLogin={this.props.toggleLogin} loggedIn={this.props.user ? true : false} />
                <div style={{position: "absolute", marginLeft: "300px", top: "64px"}}>
                    <div>
                        <img src={this.props.profile.background} className="user-background" />
                    </div>
                    <div style={{marginLeft: "50px", marginTop: "20px"}}>
                        <div className="row">
                            <div className="col s1">
                                <img src={this.props.profile.dp} className="profile-dp" />
                            </div>
                            <div className="col s6" style={{marginLeft: "20px"}}>
                                <div className="row">
                                    <h5>{this.props.profile.name}</h5><br style={{display: "none"}} />
                                    <p className="profile-subscribers">
                                        {/* TODO: Subscribers should be formatted to a string. */}
                                        {this.props.subscribers + " subscribers"}
                                    </p>
                                </div>
                            </div>
                            <div className="col s4">
                                <a className="waves-effect waves-light btn red">Subscribe</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

PublicProfile.propTypes = {
    user: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    toggleLogin: PropTypes.func.isRequired,
    subscribers: PropTypes.string.isRequired
};

export default PublicProfile;
