/* eslint-disable no-undef */
import React from "react";
import PropTypes from "prop-types";

import Navbar from "./Navbar.jsx";
import TrendingVideo from "./TrendingVideo.jsx";
import Sidebar from "./Sidebar.jsx";

class Trending extends React.Component {
    constructor(props) {
        super(props);
        this.state = {videos: null};
    }

    componentDidMount() {
        $.getJSON("http://localhost:8000/api/trending", (data) => {
            if (data.success)
                this.setState({videos: data.videos});
        });
    }

    render() {
        let content;
        if (!this.state.videos)
            content = <h5>Loading...</h5>;
        else {
            content = this.state.videos.map((element, index) => {
                return <TrendingVideo key={index}
                    thumbnail={element.thumbnail}
                    title={element.title}
                    user={element.username}
                    views={"0"}
                    age={element.age}
                    desc={element.description}
                    video_id={element.video_id} />;
            });
        }
        return (
            <div>
                <Navbar dp={this.props.user ? this.props.user.dp : "http://localhost:8000/account_circle.png"} />
                <Sidebar toggleLogin={this.props.toggleLogin} loggedIn={this.props.user ? true : false} />
                <div className="row" style={{position: "absolute", marginLeft: "350px", top: "100px", width: "25%"}}>
                    {content}
                </div>
            </div>
        );
    }
}

Trending.propTypes = {
    user: PropTypes.object,
    toggleLogin: PropTypes.func.isRequired
};

export default Trending;
