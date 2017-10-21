import React from "react";
import PropTypes from "prop-types";

class TrendingVideo extends React.Component {
    render() {
        return (
            <div className="row">
                <div className="col s3">
                    <img style={{width: 246, height: 138}} src={this.props.thumbnail} />
                </div>
                <div className="col s9">
                    <div className="row">
                        <p style={{fontSize: "16px"}}>
                            {this.props.title}
                        </p>
                    </div>
                    <div className="row">
                        <p style={{color: "#6d6d6d"}}>
                            {this.props.user + " • " + this.props.views + " views • " + this.props.age + " days agos"}
                        </p>
                    </div>
                    <div className="row">
                        <p style={{color: "#6d6d6d"}}>
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
    user: PropTypes.string.isRequired,
    views: PropTypes.string.isRequired,
    age: PropTypes.number.isRequired,
    desc: PropTypes.string.isRequired
};

export default TrendingVideo;
