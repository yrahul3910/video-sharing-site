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
        this.state = {data: {}, redirect: false};
    }

    componentDidMount() {
        $.post("http://localhost:8000/api/feed", {
            token: localStorage.getItem("token")
        }, (data) => {
            if (!data.success)
                this.setState({redirect: true});
            else {
                this.setState({data: data.details});
            }
        });
    }

    render() {
        if (this.state.redirect)
            return <Redirect to="/trending" />;

        let rows = (!this.state.data) ? <div></div> : Object.keys(this.state.data).map((val, index) => {
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
