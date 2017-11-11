/* eslint-disable no-undef */
import React from "react";
import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";
import chunk from "lodash.chunk";
import numeral from "numeral";
import moment from "moment";

import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";
import TrendingVideo from "./TrendingVideo.jsx";

class SettingsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {subscribers: 0, rows: null};
    }

    componentDidMount() {
        $.get("http://localhost:8000/api/user/" + this.props.user.username,
            (data) => {
                if (!data.success)
                    Materialize.toast(data.message);
                else {
                    this.setState({subscribers: data.data.user[0].subscribers});

                    let {videos} = data.data;
                    let rows = videos.map((vid, i) =>
                        <div key={i} style={{display: "flex"}}>
                            <div style={{width: "60%"}}>
                                <TrendingVideo thumbnail={vid.thumbnail}
                                    title={vid.title}
                                    user={vid.username}
                                    views={numeral(vid.views).format("0.0a")}
                                    age={parseInt(moment(vid.upload_date).fromNow().split(" ")[0])}
                                    desc={vid.description} />
                            </div>
                            <div style={{width: "30%"}}>
                                <a style={{width: "50%"}} className="btn waves-effect waves-light red">Delete</a>
                            </div>
                        </div>
                    );

                    this.setState({rows});
                }
            }
        );
    }

    render() {
        if (!this.props.user)
            return (
                <Redirect to="/login" />
            );

        return (
            <div>
                <Navbar dp={this.props.user.dp} />
                <Sidebar toggleLogin={this.props.toggleLogin} loggedIn={this.props.user ? true : false} />
                <div style={{position: "absolute", marginLeft: "300px", top: "64px", width: "100%"}}>
                    <div>
                        <img src={this.props.user.background} className="user-background" />
                    </div>
                    <div style={{marginLeft: "50px", marginTop: "20px"}}>
                        <div className="row">
                            <div className="col s1">
                                <img src={this.props.user.dp ? this.props.user.dp : "http://localhost:8000/account_circle.png"} className="profile-dp" />
                            </div>
                            <div className="col s6" style={{marginLeft: "20px"}}>
                                <div className="row">
                                    <h5>{this.props.user.name}</h5><br style={{display: "none"}} />
                                    <p className="profile-subscribers">
                                        {this.state.subscribers + (this.state.subscribers > 1 ? " subscribers" : " subscriber")}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <h4>Your Videos</h4>
                            <div className="row">
                                {this.state.rows}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

SettingsPage.propTypes = {
    user: PropTypes.object,
    toggleLogin: PropTypes.func.isRequired
};

export default SettingsPage;
