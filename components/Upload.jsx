/* eslint-disable no-undef */
import React from "react";
import PropTypes from "prop-types";

import Navbar from "./Navbar.jsx";
import VideoSelectionCard from "./VideoSelectionCard.jsx";
import VideoUploadCard from "./VideoUploadCard.jsx";

class Upload extends React.Component {
    constructor(props) {
        super(props);
        this.selectClick = this.selectClick.bind(this);
        this.changeClick = this.changeClick.bind(this);
        this.state = {selected: false, firstClick: true};
    }

    selectClick(e) {
        let filename = $("#videoUpload").val();
        if (filename) {
            this.setState({selected: true});
            e.preventDefault();
        }
    }

    changeClick() {
        let filename = $("#videoUpload").val();
        if (filename)
            this.setState({firstClick: false});
    }

    render() {
        let card;
        if (this.state.selected)
            card = <VideoUploadCard />;
        else
            card = <VideoSelectionCard
                text={this.state.firstClick ? "Click here to upload a video" : "File selected. Click to continue."}
                changeClick={this.changeClick}
                selectClick={this.selectClick} />;
        return (
            <div>
                <Navbar dp="https://d1wn0q81ehzw6k.cloudfront.net/additional/thul/media/0eaa14d11e8930f5?w=400&h=400" />
                {card}
            </div>
        );
    }
}

export default Upload;
