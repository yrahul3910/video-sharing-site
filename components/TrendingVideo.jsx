import React from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";

class TrendingVideo extends React.Component {
    render() {
        return (
            <div style={{width: "calc(100vw - 350px)", marginTop: "10px", display: "flex"}}>
                <div>
                    <img style={{width: 246, height: 138}} src={this.props.thumbnail} />
                </div>
                <div style={{width: "100%"}}>
                    <div className="video">
                        <Link to={"/watch/" + this.props.video_id}>
                            <p style={{fontSize: "16px"}}>
                                {this.props.title}
                            </p>
                        </Link>
                    </div>
                    <div className="video">
                        <Link to={"/profile/" + this.props.user}>
                            <p style={{color: "#6d6d6d"}}>
                                {this.props.user + " • " + this.props.views + " views • " + this.props.age + " days ago"}
                            </p>
                        </Link>
                    </div>
                    <div className="video">
                        <p className="video-desc" style={{color: "#6d6d6d"}}>
                            {this.props.desc}
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

TrendingVideo.propTypes = {
    thumbnail: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    user: PropTypes.string.isRequired, // this is the username
    views: PropTypes.string.isRequired,
    age: PropTypes.number.isRequired,
    desc: PropTypes.string.isRequired,
    video_id: PropTypes.number.isRequired
};

export default TrendingVideo;
