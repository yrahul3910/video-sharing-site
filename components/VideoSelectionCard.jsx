import React from "react";
import PropTypes from "prop-types";

class VideoSelectionCard extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="row center" style={{position: "absolute", top: "100px", width: "35%"}}>
                <div className="card green">
                    <span className="card-title white-text">
                        <i className="material-icons" style={{fontSize: "4.5em", marginTop: "10px"}} >cloud_upload</i>
                    </span>
                    <div className="card-content white-text">
                        <div className="file-field input-field">
                            <input type="file" id="videoUpload" accept="video/mp4,video/x-m4v,video/*"
                                onChange={this.props.changeClick} onClick={this.props.selectClick} />
                            <div className="file-path-wrapper">
                                <h5>{this.props.text}</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

VideoSelectionCard.propTypes = {
    selectClick: PropTypes.func.isRequired,
    changeClick: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired
};

export default VideoSelectionCard;
