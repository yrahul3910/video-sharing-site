import React from "react";
import {Link} from "react-router-dom";

class VideoUploadCard extends React.Component {
    render() {
        return (
            <div className="row center" style={{position: "absolute", top: "100px", width: "35%"}}>
                <div className="card z-depth-2">
                    <span className="card-title">
                        Upload Options
                    </span>
                    <div className="card-content white-text">
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
                                    <div className="btn">
                                        <span>File</span>
                                        <input type="file" accept="image/*" />
                                    </div>
                                    <div className="file-path-wrapper">
                                        <input className="file-path validate" placeholder="Select a thumbnail" id="thumbnail" type="text" />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col s6 input-field">
                                    <input type="checkbox" defaultChecked="checked" className="filled-in" id="allowComments" />
                                    <label htmlFor="allowComments">Allow Comments</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-action">
                        <Link to="#" className="green-text">Upload</Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default VideoUploadCard;
