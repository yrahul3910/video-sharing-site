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
            dp: "",
            name: "Unknown",
            subscribers: 0
        }, invalid: false, subscribed: false};
        this.toggleSubscription = this.toggleSubscription.bind(this);
    }

    componentDidMount() {
        $.get("http://localhost:8000/api/user/" + this.props.match.params.user, (data) => {
            if (data.success) {
                let chunks = chunk(data.data.videos, 4);
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
                this.setState({rows, profile: data.data.user[0]});
            }
            else {
                this.setState({invalid: true});
                Materialize.toast(data.message, 4000, "rounded");
            }
        });
        $.post("http://localhost:8000/api/check_subscription", {
            token: localStorage.getItem("token"),
            profile: this.props.match.params.user
        }, (data) => {
            if (data.subscribed)
                this.setState({subscribed: true});
        });
    }

    toggleSubscription() {
        if (!this.props.user)
            Materialize.toast("You need to be logged in to subscribe.", 2000, "rounded");
        else {
            $.post("http://localhost:8000/api/toggle_subscription", {
                token: localStorage.getItem("token"),
                profile: this.props.match.params.user
            }, (data) => {
                if (data.success)
                    Materialize.toast("Subscription successful!", 2000, "rounded");
                else
                    Materialize.toast(data.message, 2000, "rounded");
            });
        }
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
                    <div style={{marginLeft: "50px", marginTop: "20px"}}>
                        <div className="row">
                            <div className="col s1">
                                <img src={this.state.profile.dp} className="profile-dp" />
                            </div>
                            <div className="col s5" style={{marginLeft: "20px"}}>
                                <div className="row">
                                    <h5>{this.state.profile.name}</h5><br style={{display: "none"}} />
                                    <p className="profile-subscribers">
                                        {this.state.profile.subscribers + " subscriber" +
                                            (this.state.profile.subscribers > 1 ? " s" : "")}
                                    </p>
                                </div>
                            </div>
                            <div className="col s2">
                                <a onClick={this.toggleSubscription}
                                    className="waves-effect waves-light btn red">
                                    {"Subscribe" + (this.state.subscribed ? "d" : "")}
                                </a>
                            </div>
                        </div>
                    </div>
                    <div style={{marginLeft: "50px"}}>
                        {this.state.rows}
                    </div>
                </div>
            </div>
        );
    }
}

PublicProfile.propTypes = {
    user: PropTypes.object,
    toggleLogin: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired
};

export default PublicProfile;
