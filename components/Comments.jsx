/* eslint-disable no-undef */
import React from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import moment from "moment";

class Comments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data: []};
    }

    componentDidMount() {
        $.post("http://localhost:8000/api/comments", {id: this.props.video_id}, (data) => {
            if (data.success) {
                this.setState({data: data.data});
            }
        });
    }

    render() {
        let comments = this.state.data.comments;
        let replies = this.state.data.replies;

        if (!comments) return <div></div>;
        let mainDivs = comments.map((val, i) => {
            let replyDiv = replies.filter((rep) => {
                return rep.comment_id == val.comment_id;
            }).map((reply, j) =>
                <div key={j} style={{display: "flex"}}>
                    <img style={{width: "30px", height: "30px", marginRight: "15px"}} src={reply.dp ? reply.dp : "http://localhost:8000/account_circle.png"} />
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <div style={{display: "flex"}}>
                            <Link style={{color: "black"}} to={"/profile/" + reply.username}>
                                <b>{reply.name}</b>
                            </Link>
                            <span style={{color: "#212121", marginTop: "0", marginLeft: "10px"}}>
                                {moment(reply.reply_date).fromNow()}
                            </span>
                        </div>
                        <p style={{marginTop: "0"}}>{reply.reply_text}</p>
                    </div>
                </div>
            );

            return (
                <div style={{display: "flex"}} key={i}>
                    <img src={val.dp ? val.dp : "http://localhost:8000/account_circle.png"}
                        className="round" style={{width: "30px", height: "30px", marginRight: "15px"}} />
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <div style={{display: "flex"}}>
                            <Link style={{color: "black"}} to={"/profile/" + val.username}>
                                <b>{val.name}</b>
                            </Link>
                            <span style={{color: "#212121", marginTop: "0", marginLeft: "10px"}}>
                                {moment(val.comment_date).fromNow()}
                            </span>
                        </div>
                        <p style={{marginTop: "0"}}>{val.comment}</p>

                        {/* Load the replies now */}
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
    video_id: PropTypes.string.isRequired
};

export default Comments;
