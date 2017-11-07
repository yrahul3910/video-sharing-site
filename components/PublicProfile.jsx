/* eslint-disable no-undef */
import React from "react";
import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";
import chunk from "lodash.chunk";
import numeral from "numeral";
import moment from "moment";

import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";
import ThumbnailRow from "./ThumbnailRow.jsx";

class PublicProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {rows: null, profile: {
            background: "",
            dp: "",
            name: "Unknown",
            subscribers: 0
        }, invalid: false};
    }

    componentDidMount() {
        // TODO: Implement /api/videos
        $.post("http://localhost:8000/api/videos", {
            token: localStorage.getItem("token"),
            user: this.props.match.params.user
        }, (data) => {
            if (!data.success)
                Materialize.toast(data.message);
            else {
                let chunks = chunk(data.videos, 4);
                let rows = chunks.map((val, i) =>
                    <ThumbnailRow key={i} data={{
                        title: "",
                        thumbnails: val.map((video) => {
                            return {
                                url: "/watch/" + video.video_id,
                                img: video.thumbnail,
                                title: video.title,
                                views: numeral(video.views).format("0.0a"),
                                channel: {
                                    title: video.username,
                                    url: "/profile/" + video.username
                                },
                                date: moment(new Date()).fromNow()
                            };
                        })
                    }} />
                );
                this.setState({rows});
            }
        });

        $.get("http://localhost:8000/api/user/" + this.props.match.params.user, (data) => {
            if (data.success)
                this.setState({profile: data.data});
            else {
                this.setState({invalid: true});
                Materialize.toast(data.message, 4000, "rounded");
            }
        });
    }

    render() {
        if (this.state.invalid)
            return (
                <Redirect to="/" />
            );

        return (
            <div>
                <Navbar dp={this.props.user ? this.props.user.dp : "http://localhost:8000/account_circle.png"} />
                <Sidebar toggleLogin={this.props.toggleLogin} loggedIn={this.props.user ? true : false} />
                <div style={{position: "absolute", marginLeft: "300px", top: "64px", width: "100%"}}>
                    <div>
                        <img src={this.state.profile.background} className="user-background" />
                    </div>
                    <div style={{marginLeft: "50px", marginTop: "20px"}}>
                        <div className="row">
                            <div className="col s1">
                                <img src={this.state.profile.dp} className="profile-dp" />
                            </div>
                            <div className="col s5" style={{marginLeft: "20px"}}>
                                <div className="row">
                                    <h5>{this.state.profile.name}</h5><br style={{display: "none"}} />
                                    <p className="profile-subscribers">
                                        {this.state.profile.subscribers + " subscribers"}
                                    </p>
                                </div>
                            </div>
                            <div className="col s2">
                                {/* TODO: Handle this click event */}
                                <a className="waves-effect waves-light btn red">Subscribe</a>
                            </div>
                        </div>
                    </div>
                    <div>
                        {this.state.rows}
                    </div>
                </div>
            </div>
        );
    }
}

PublicProfile.propTypes = {
    user: PropTypes.object.isRequired,
    toggleLogin: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired
};

export default PublicProfile;
