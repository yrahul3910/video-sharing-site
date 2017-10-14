/* eslint-disable no-undef */
import React from "react";
import PropTypes from "prop-types";

import Navbar from "./Navbar.jsx";

class Upload extends React.Component {
    constructor(props) {
        super(props);
        this.selectClick = this.selectClick.bind(this);
    }

    selectClick() {
        let filename = $("#videoUpload").val();
        if (filename) {
            /* TODO: Change the state here, so it lets the user choose more options.
            The component should render differently based on this state, with
            the initial state being the UI where the user simply clicks the
            card to select a file. */
        }
    }

    render() {
        return (
            <div>
                <Navbar dp="https://d1wn0q81ehzw6k.cloudfront.net/additional/thul/media/0eaa14d11e8930f5?w=400&h=400" />
                <div className="row center" style={{position: "absolute", top: "100px", width: "35%"}}>
                    <div className="card green">
                        <span className="card-title white-text">
                            <i className="material-icons" style={{fontSize: "4.5em", marginTop: "10px"}} >cloud_upload</i>
                        </span>
                        <div className="card-content white-text">
                            <form action="/upload">
                                <div className="file-field input-field">
                                    <input type="file" id="videoUpload" onClick={this.selectClick} />
                                    <div className="file-path-wrapper">
                                        <h5>Click here to upload a file</h5>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Upload;
