/* eslint-disable no-undef */
import React from "react";
import PropTypes from "prop-types";
import {Redirect, Link} from "react-router-dom";
import numeral from "numeral";

import Navbar from "./Navbar.jsx";
import Comments from "./Comments.jsx";

class WatchPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {video: {}, error: false};
    }

    componentDidMount() {
        let id = this.props.match.params.id;
        $.post("http://localhost:8000/api/video", {id}, (data) => {
            if (!data.success) {
                Materialize.toast("Couldn't load the video.", 2500, "rounded");
                this.setState({error: true});
            } else {
                this.setState({video: data.details});
            }
        });
    }

    render() {
        if (this.state.error)
            return <Redirect to="/" />;

        return (
            <div>
                <Navbar dp={this.props.user ? this.props.user.dp : "http://localhost:8000/account_circle.png"} />
                <div style={{position: "absolute", top: "80px", width: "100%"}}>
                    <div style={{display: "flex"}}>
                        <div style={{display: "flex", flexDirection: "column", width: "62.5%", marginLeft: "3.75%"}}>
                            <video controls="true" preload="metadata" poster={this.state.video.thumbnail}
                                src={this.state.video.video_path} style={{height: "calc(62.5% - 64px)", outline: "none"}}>
                            </video>
                            <div style={{display: "flex", justifyContent: "space-between", alignItems: "baseline"}}>
                                <div style={{width: "25%"}}>
                                    <p style={{fontSize: "20px", marginBottom: "0"}}>{this.state.video.title}</p>
                                    <p style={{color: "#212121", fontSize: "18px", fontWeight: "lighter", marginTop: "0"}}>{this.state.video.views + " views"}</p>
                                </div>
                                <div style={{width: "25%", display: "flex", alignItems: "center"}}>
                                    <i style={{marginRight: "10px"}} className="material-icons">thumb_up</i>
                                    <span style={{verticalAlign: "middle"}}>{numeral(this.state.video.upvotes).format("0a")}</span>
                                    <i style={{marginRight: "10px", marginLeft: "20px"}} className="material-icons">thumb_down</i>
                                    <span style={{verticalAlign: "middle"}}>{" " + numeral(this.state.video.downvotes).format("0a")}</span>
                                </div>
                            </div>
                            <hr style={{width: "100%"}} />
                            <div style={{display: "flex"}}>
                                <img src={this.state.video.dp ? this.state.video.dp : "http://localhost:8000/account_circle.png"}
                                    className="round" style={{width: "50px", height: "50px", marginRight: "15px"}} />
                                <div style={{display: "flex", flexDirection: "column"}}>
                                    <Link style={{color: "black"}} to={"/profile/" + this.state.video.username}>
                                        <b>{this.state.video.name}</b>
                                    </Link>
                                    <p style={{color: "#212121", marginTop: "0"}}>Published on {new Date(this.state.video.upload_date).toDateString()}</p>
                                    <p>{this.state.video.description}</p>
                                </div>
                            </div>
                            <hr style={{width: "100%"}} />
                            <Comments video_id={this.props.match.params.id} />
                        </div>
                        <div style={{display: "flex", flexDirection: "column", width: "30%", marginLeft: "3.75%"}}>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

WatchPage.propTypes = {
    match: PropTypes.object,
    user: PropTypes.object
};

export default WatchPage;
