/* eslint-disable no-undef */
import React from "react";
import PropTypes from "prop-types";
import {Redirect} from "react-router-dom";

import Navbar from "./Navbar.jsx";

class Feedback extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loggedIn: (this.props.user ? true : false)};
        this.click = this.click.bind(this);
    }

    click() {
        let feedback = $("#feedback").val();
        if (feedback.trim() == "") {
            Materialize.toast("You may not submit empty feedback.", 2000, "rounded");
            return;
        }
        $.post("http://localhost:8000/api/feedback", {
            token: localStorage.getItem("token"),
            feedback
        }, (res) => {
            Materialize.toast(res.message, 4000);
        });
    }

    render() {
        if (!this.state.loggedIn) {
            Materialize.toast("You need to be logged in!", 4000);
            return (
                <Redirect to="/login" />
            );
        }
        return (
            <div>
                <Navbar dp={this.props.user.dp} />
                <div className="row center" style={{position: "absolute", top: "100px", width: "25%"}}>
                    <h5>Tell us how we&rsquo;re doing!</h5>
                    <div className="row">
                        <div className="input-field col s12">
                            <textarea id="feedback" className="materialize-textarea"></textarea>
                            <label htmlFor="feedback">Feedback</label>
                        </div>
                    </div>
                    <div className="row">
                        <a onClick={this.click} className="waves-effect waves-light btn">Submit</a>
                    </div>
                </div>
            </div>
        );
    }
}

Feedback.propTypes = {
    user: PropTypes.object
};

export default Feedback;
