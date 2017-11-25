/* eslint-disable no-undef */
import React from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import moment from "moment";

class Comments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data: []};
        this.submitReply = this.submitReply.bind(this);
    }

    componentDidMount() {
        $.post("http://localhost:8000/api/comments", {id: this.props.video_id}, (data) => {
            if (data.success) {
                this.setState({data: data.data});
            }
        });
    }

    submitReply(e) {
        let comment_id = e.currentTarget.id.split("addReply")[1];
        let text = $("#reply" + comment_id).val();

        if (text.trim() == "") {
            Materialize.toast("You may not submit empty replies.", 2000, "rounded");
            return;
        }

        $.post("http://localhost:8000/api/reply", {
            comment_id,
            text,
            token: localStorage.getItem("token")
        }, (data) => {
            console.log(this.props.user);
            if (data.success) {
                let reply = {
                    name: this.props.user.name,
                    username: this.props.user.username,
                    dp: this.props.user.dp,
                    reply_date: moment(new Date().toISOString()).fromNow(),
                    reply_text: text,
                    comment_id
                };
                console.log(reply);

                let currentData = this.state.data.replies;
                currentData.push(reply);
                let newData = this.state.data;
                newData.replies = currentData;

                this.setState({data: newData});
                Materialize.toast("Reply added!", 2000, "rounded");
                $("#reply" + comment_id).val("");
            }
        });
    }

    render() {
        let comments = this.state.data.comments;
        let replies = this.state.data.replies;

        if (!comments) return <div></div>;

        let mainDivs = comments.map((val, i) => {
            /*
                First, take only the replies for the current comment, using
                Array.prototype.filter. Then, map each of them to the
                required HTML, and get this whole HTML for all the replies
                *of the current comment* in one variable, called replyDiv.
            */
            let replyDiv = replies.filter((rep) => {
                return rep.comment_id == val.comment_id;
            }).map((reply, j) =>
                <div key={j} style={{display: "flex", flexDirection: "column"}}>
                    <div style={{display: "flex"}}>
                        <img className="round" style={{width: "30px", height: "30px", marginRight: "15px"}} src={reply.dp ? reply.dp : "http://localhost:8000/account_circle.png"} />
                        <div style={{display: "flex", flexDirection: "column"}}>
                            <Link style={{color: "black"}} to={"/profile/" + reply.username}>
                                <b>{reply.name}</b>
                            </Link>
                            <span style={{color: "gray", marginTop: "0", marginLeft: "10px"}}>
                                {moment(reply.reply_date).fromNow()}
                            </span>
                            <p style={{marginTop: "0"}}>{reply.reply_text}</p>
                        </div>
                    </div>
                </div>
            );

            /*
                Now, actually map each comment to HTML, and render the replies correctly
                using the replyDiv that we got earlier. This gives us all the comments
                with their replies, and we call that mainDiv.
            */
            return (
                <div style={{display: "flex"}} key={i}>
                    <img src={val.dp ? val.dp : "http://localhost:8000/account_circle.png"}
                        className="round" style={{width: "30px", height: "30px", marginRight: "15px"}} />
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <div style={{display: "flex"}}>
                            <Link style={{color: "black"}} to={"/profile/" + val.username}>
                                <b>{val.name}</b>
                            </Link>
                            <span style={{color: "gray", marginTop: "0", marginLeft: "10px"}}>
                                {moment(val.comment_date).fromNow()}
                            </span>
                        </div>
                        <p style={{marginTop: "0"}}>{val.comment}</p>

                        {/* Load the replies now */}
                        {this.props.user ? (
                            <div style={{display: "flex"}}>
                                <img src={this.props.user.dp ? this.props.user.dp : "http://localhost:8000/account_circle.png"}
                                    className="round" style={{width: "30px", height: "30px", marginRight: "15px"}} />
                                <div style={{display: "flex"}}>
                                    <div className="input-field" style={{width: "100%"}}>
                                        <input type="text" id={"reply" + val.comment_id} />
                                        <label htmlFor={"reply" + val.comment_id}>Add a reply...</label>
                                    </div>
                                    <a id={"addReply" + val.comment_id} onClick={this.submitReply} className="btn waves-effect waves-light green"
                                        style={{marginBottom: "20px", marginLeft: "20px"}}>
                                        Reply
                                    </a>
                                </div>
                            </div>
                        ) : <div></div>}
                        {replyDiv}
                    </div>
                </div>
            );
        });

        return (
            <div>
                {mainDivs}
            </div>
        );
    }
}

Comments.propTypes = {
    video_id: PropTypes.string.isRequired,
    user: PropTypes.object
};

export default Comments;
