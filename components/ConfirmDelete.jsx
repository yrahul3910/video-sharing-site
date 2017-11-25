/* eslint-disable no-undef */
import React from "react";
import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";

import Navbar from "./Navbar.jsx";

class ConfirmDelete extends React.Component {
    constructor(props) {
        super(props);

        this.state = {confirmed: false};
        this.confirm = this.confirm.bind(this);
    }

    confirm() {
        let pwd = $("#password").val();
        $.ajax({
            url: "http://localhost:8000/api/user",
            method: "DELETE",
            contentType: "application/json",
            data: JSON.stringify({
                token: localStorage.getItem("token"),
                pwd
            }),
            success: (data) => {
                if (data.success) {
                    Materialize.toast("Your account has been deleted.", 2500, "rounded");
                    localStorage.clear();
                    this.props.toggleLogin(null);
                    this.setState({confirmed: true});
                } else
                    Materialize.toast(data.message, 4000, "rounded");
            }
        });
    }

    render() {
        if (this.state.confirmed)
            return <Redirect to="/" />;

        return (
            <div>
                <Navbar dp={this.props.user ? this.props.user.dp : "http://localhost:8000/account_circle.png"} />
                <div style={{position: "absolute", top: "100px", width: "100%"}}>
                    <div className="row center">
                        <img className="profile-dp" src={this.props.user ? this.props.user.dp : "http://localhost:8000/account_circle.png"} />
                    </div>
                    <div className="row">
                        <div className="col s4 offset-s4">
                            <h5>You are about to delete your account. This action cannot be undone! To confirm,
                            please re-enter your password.</h5>
                            <input id="password" type="password" className="validate" />
                            <label htmlFor="password">Password</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col s4 offset-s4">
                            <a onClick={this.confirm} className="btn waves-effect waves-light red">
                                Confirm account deletion
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ConfirmDelete.propTypes = {
    user: PropTypes.object,
    toggleLogin: PropTypes.func.isRequired
};

export default ConfirmDelete;
