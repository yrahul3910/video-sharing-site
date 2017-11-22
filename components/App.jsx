/* eslint-disable no-undef */
import React from "react";
import PropTypes from "prop-types";
import {Redirect} from "react-router-dom";
import moment from "moment";

import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";
import ThumbnailRow from "./ThumbnailRow.jsx";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data: {}, redirect: false, doge: false};
    }

    componentDidMount() {
        $.post("http://localhost:8000/api/feed", {
            token: localStorage.getItem("token")
        }, (data) => {
            if (!data.success)
                this.setState({redirect: true});
            else {
                this.setState({data: data.details});

                if (Object.keys(this.state.data).length === 0)
                    this.setState({doge: true});
            }
        });
    }

    render() {
        if (this.state.doge)
            return <Redirect to="/suchempty" />;

        if (this.state.redirect)
            return <Redirect to="/trending" />;

        /*
            The server returns the data of the videos for the feed, grouped by username. Thus,
            this.state.data is an object, whose keys are usernames that the user has subscribed
            to.

            Each value corresponding to the username keys in this.state.data is an array, which
            is all the videos that that user (the one that the current user has subscribed *to*)
            has uploaded. So we iterate over these keys, which gives us all these arrays, and
            we gotta convert these arrays to ThumbnailRow components. We need to use
            Array.prototype.map for this, which does a wonderful job for us.

            If this is confusing to you, do a console.log for both obj and this.state.data and
            you'll see how this works.
        */
        let rows = (!this.state.data) ? <div></div> : Object.keys(this.state.data).map((val, index) => {
            if (index > 3) return null;

            let obj = this.state.data[val];

            return (
                <ThumbnailRow key={index}
                    data={
                        {
                            title: val,
                            thumbnails: obj.map((video) => {
                                return {
                                    url: `/watch/${video.video_id}`,
                                    img: video.thumbnail,
                                    title: video.title,
                                    views: video.views,
                                    channel: {
                                        title: video.username,
                                        url: `/profile/${video.username}`
                                    },
                                    date: moment(new Date(video.upload_date)).fromNow()
                                };
                            })
                        }
                    }
                />
            );
        });

        return (
            <div>
                <Navbar dp={this.props.user ? this.props.user.dp : "http://localhost:8000/account_circle.png"} />
                <Sidebar toggleLogin={this.props.toggleLogin} loggedIn={this.props.user ? true : false} />
                <div style={{position: "absolute", marginLeft: "350px", top: "100px", width: "100%"}}>
                    {rows}
                </div>
            </div>
        );
    }
}

App.propTypes = {
    user: PropTypes.object,
    toggleLogin: PropTypes.func.isRequired
};

export default App;
