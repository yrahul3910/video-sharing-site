import React from "react";
import PropTypes from "prop-types";

class VideoUploadCard extends React.Component {
    render() {
        return (
            <div className="row center" style={{position: "absolute", top: "100px", width: "35%"}}>
                <div className="card z-depth-2">
                    <span className="card-title">
                        Upload Options
                    </span>
                    <div className="card-content">
                        <div className="row">
                            <div className="row">
                                <div className="input-field">
                                    <input id="video_title" type="text" />
                                    <label htmlFor="video_title">Video Title</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field">
                                    <textarea className="materialize-textarea" id="video_desc" />
                                    <label htmlFor="video_desc">Video Description</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="file-field input-field">
                                    <input type="file" id="thumbnailUpload" accept="image/*" />
                                    <div className="file-path-wrapper">
                                        <input className="file-path validate" id="thumbnail" type="text" />
                                        <label style={{fontFamily: "Roboto", fontSize: "1.25rem"}} htmlFor="thumbnail">Thumbnail</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-action">
                        <a onClick={this.props.submit} className="green-text">Upload</a>
                    </div>
                </div>
            </div>
        );
    }
}

VideoUploadCard.propTypes = {
    submit: PropTypes.func.isRequired
};

export default VideoUploadCard;
