/* eslint-disable no-undef */
import React from "react";
import PropTypes from "prop-types";
import {Redirect, Link} from "react-router-dom";
import numeral from "numeral";

import Navbar from "./Navbar.jsx";
import Comments from "./Comments.jsx";
import TrendingVideo from "./TrendingVideo.jsx";

class WatchPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {video: {}, error: false, recommendations: []};
        this.submitComment = this.submitComment.bind(this);
        this.submitUpvote = this.submitUpvote.bind(this);
        this.submitDownvote = this.submitDownvote.bind(this);
        this.addView = this.addView.bind(this);
    }

    componentDidMount() {
        let id = this.props.match.params.id;
        $.post("http://localhost:8000/api/video", {id, token: localStorage.getItem("token")}, (data) => {
            if (!data.success) {
                Materialize.toast("Couldn't load the video.", 2500, "rounded");
                this.setState({error: true});
            } else {
                this.setState({video: data.details});
                let userRating = data.details.user_rating;
                if (userRating == 1)
                    $("#upvote").css("color", "green");
                else if (userRating == -1)
                    $("#downvote").css("color", "green");

                $.get("http://localhost:8000/api/user/" + data.details.username, (result) => {
                    this.setState({recommendations: result.data.videos});
                });
            }
        });

        /*
            Use the Page Visibility API to pause the video when the tab is not being viewed.
            This prevents abuse of video views, and ensures users don't need to manually
            pause the video in legitimate cases. Code taken from:
            https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
        */
        let hidden, visibilityChange;
        let videoElement = document.getElementById("video");
        if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
            hidden = "hidden";
            visibilityChange = "visibilitychange";
        } else if (typeof document.msHidden !== "undefined") {
            hidden = "msHidden";
            visibilityChange = "msvisibilitychange";
        } else if (typeof document.webkitHidden !== "undefined") {
            hidden = "webkitHidden";
            visibilityChange = "webkitvisibilitychange";
        }
        document.addEventListener(visibilityChange, () => {
            if (document[hidden])
                videoElement.pause();
            else
                videoElement.play();
        }, false);
    }

    submitUpvote() {
        let userRating = this.state.video.user_rating;
        let details = this.state.video;
        if (userRating == 1) {
            // Remove the upvote
            $.post("http://localhost:8000/api/votes", {
                token: localStorage.getItem("token"),
                video_id: details.video_id,
                action: "remove",
            }, (data) => {
                if (data.success) {
                    $("#upvote").css("color", "black");
                    details.user_rating = 0;
                    details.upvotes -= 1;
                } else {
                    Materialize.toast("You need to be logged in to vote.", 2000, "rounded");
                }
            });
        } else if (userRating == -1) {
            // Remote downvote and add upvote
            $.post("http://localhost:8000/api/votes", {
                token: localStorage.getItem("token"),
                video_id: details.video_id,
                action: "update"
            }, (data) => {
                if (data.success) {
                    $("#upvote").css("color", "green");
                    $("#downvote").css("color", "black");
                    details.user_rating = 1;
                    details.upvotes += 1;
                    details.downvotes -= 1;
                } else {
                    Materialize.toast("You need to be logged in to vote.", 2000, "rounded");
                }
            });
        } else {
            // Add a new upvote
            $.post("http://localhost:8000/api/votes", {
                token: localStorage.getItem("token"),
                video_id: details.video_id,
                action: "add",
                vote: 1
            }, (data) => {
                if (data.success) {
                    $("#upvote").css("color", "green");
                    details.upvotes += 1;
                    details.user_rating = 1;
                } else {
                    Materialize.toast("You need to be logged in to vote.", 2000, "rounded");
                }
            });
        }
        this.setState({video: details});
    }

    submitDownvote() {
        let userRating = this.state.video.user_rating;
        let details = this.state.video;
        if (userRating == 1) {
            // Remove the upvote and add downvote
            $.post("http://localhost:8000/api/votes", {
                token: localStorage.getItem("token"),
                video_id: details.video_id,
                action: "update",
            }, (data) => {
                if (data.success) {
                    $("#upvote").css("color", "black");
                    $("#downvote").css("color", "green");
                    details.user_rating = -1;
                    details.upvotes -= 1;
                    details.downvotes += 1;
                } else {
                    Materialize.toast("You need to be logged in to vote.", 2000, "rounded");
                }
            });
        } else if (userRating == -1) {
            // Remote downvote
            $.post("http://localhost:8000/api/votes", {
                token: localStorage.getItem("token"),
                video_id: details.video_id,
                action: "remove"
            }, (data) => {
                if (data.success) {
                    $("#downvote").css("color", "black");
                    details.user_rating = 0;
                    details.downvotes -= 1;
                } else {
                    Materialize.toast("You need to be logged in to vote.", 2000, "rounded");
                }
            });
        } else {
            // Add a new downvote
            $.post("http://localhost:8000/api/votes", {
                token: localStorage.getItem("token"),
                video_id: details.video_id,
                action: "add",
                vote: -1
            }, (data) => {
                if (data.success) {
                    $("#downvote").css("color", "green");
                    details.downvotes += 1;
                    details.user_rating = -1;
                } else {
                    Materialize.toast("You need to be logged in to vote.", 2000, "rounded");
                }
            });
        }
        this.setState({video: details});
    }

    addView() {
        $.post("http://localhost:8000/api/video/add_view", {
            video_id: this.props.match.params.id
        }, () => {});
    }

    submitComment() {
        let comment = $("textarea").val();
        if (comment.trim() == "") {
            Materialize.toast("You may not submit empty comments.", 2000, "rounded");
            return;
        }

        $.post("http://localhost:8000/api/comment", {
            video_id: this.props.match.params.id,
            comment,
            token: localStorage.getItem("token")
        }, (data) => {
            if (!data.success)
                Materialize.toast("Failed to submit comment.", 2000, "rounded");
            else {
                Materialize.toast("Comment successfully added!", 2000, "rounded");
                $("#comment").val("");
            }
        });
    }

    render() {
        if (this.state.error)
            return <Redirect to="/" />;

        let commentBox = this.props.user ? (
            <div>
                <div style={{display: "flex"}}>
                    <img src={this.props.user.dp ? this.props.user.dp : "http://localhost:8000/account_circle.png"}
                        className="round" style={{width: "50px", height: "50px", marginRight: "15px"}} />
                    <div className="input-field" style={{width: "100%"}}>
                        <textarea id="comment" className="materialize-textarea"></textarea>
                        <label htmlFor="comment">Add a public comment...</label>
                    </div>
                </div>
                <a onClick={this.submitComment} className="btn-flat waves-effect waves-light"
                    style={{marginBottom: "20px", marginLeft: "50px", color: "gray"}}>
                    <b>COMMENT</b>
                </a>
            </div>
        ) : <div></div>;

        let recommendDiv = this.state.recommendations ? this.state.recommendations.map((val, i) =>
            <div style={{overflowX: "hidden"}} className="shrink" key={i}>
                <TrendingVideo thumbnail={val.thumbnail}
                    title={val.title}
                    user={val.username}
                    video_id={val.video_id} />
            </div>
        ) : <div></div>;

        return (
            <div>
                <Navbar dp={this.props.user ? this.props.user.dp : "http://localhost:8000/account_circle.png"} />
                <div style={{position: "absolute", top: "80px", width: "100%"}}>
                    <div style={{display: "flex"}}>
                        <div style={{display: "flex", flexDirection: "column", width: "62.5%", marginLeft: "3.75%"}}>
                            <video id="video" controls="true" preload="metadata" poster={this.state.video.thumbnail}
                                className="responsive-video" src={this.state.video.video_path}
                                style={{outline: "none"}} onEnded={this.addView}>
                            </video>
                            <div style={{display: "flex", justifyContent: "space-between", alignItems: "baseline"}}>
                                <div style={{width: "25%"}}>
                                    <p style={{fontSize: "20px", marginBottom: "0"}}>
                                        {this.state.video.title}
                                    </p>
                                    <p style={{color: "#212121", fontSize: "18px",
                                        fontWeight: "lighter", marginTop: "0"}}>
                                        {this.state.video.views + " views"}
                                    </p>
                                </div>
                                <div style={{width: "25%", display: "flex", alignItems: "center"}}>
                                    <i style={{marginRight: "10px"}} onClick={this.submitUpvote}
                                        id="upvote" className="link material-icons">
                                        thumb_up
                                    </i>
                                    <span style={{verticalAlign: "middle"}}>
                                        {numeral(this.state.video.upvotes).format("0a")}
                                    </span>
                                    <i style={{marginRight: "10px", marginLeft: "20px"}}
                                        onClick={this.submitDownvote} id="downvote" className="link material-icons">
                                        thumb_down
                                    </i>
                                    <span style={{verticalAlign: "middle"}}>{" " + numeral(this.state.video.downvotes).format("0a")}</span>
                                </div>
                            </div>
                            <hr style={{width: "100%", color: "#212121"}} />
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
                            <hr style={{width: "100%", color: "#212121"}} />
                            <p style={{fontSize: "18px"}}>Comments</p>
                            {commentBox}
                            <Comments user={this.props.user} video_id={this.props.match.params.id} />
                        </div>
                        <div style={{display: "flex", flexDirection: "column", width: "30%", marginLeft: "3.75%"}}>
                            <p style={{fontSize: "18px"}}>Videos by this user</p>
                            {recommendDiv}
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
