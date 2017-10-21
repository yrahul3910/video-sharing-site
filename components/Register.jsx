/* eslint-disable no-undef */
import React from "react";
import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";

import Navbar from "./Navbar.jsx";

class Register extends React.Component {
    /*
        props:
            toggleLogin: Function that is called when user is done registering
            user: User details
    */
    constructor(props) {
        super(props);
        this.state = {loggedIn: (this.props.user ? true : false)};
        this.click = this.click.bind(this);
    }

    click() {
        let name = $("#name").val();
        let username = $("#username").val();
        let password = $("#password").val();

        $.post("http://localhost:8000/api/register", {
            username,
            password,
            name,
        }, (data) => {
            if (!data.success)
                $("#message").html(`<span style='color: red'>${data.message}</span>`);
            else {
                $("#message").html(`<span style='color: green'>${data.message}</span>`);
                this.props.toggleLogin({
                    name,
                    username,
                    dp: null
                });

                localStorage.setItem("token", data.token);
                this.setState({loggedIn: true});
            }
        });
    }

    render() {
        if (this.state.loggedIn)
            return (
                <Redirect to="/" />
            );
        return (
            <div>
                <Navbar dp={this.props.user ? this.props.user.dp : "http://localhost:8000/account_circle.png"} />
                <div className="row center" style={{position: "absolute", top: "90px", width: "25%"}}>
                    <div id="message"></div>
                </div>

                <div className="row center" style={{position: "absolute", top: "120px", width: "25%"}}>
                    <form>
                        <div className="row">
                            <div className="input-field col-md-4 col-md-offset-4">
                                <i className="material-icons prefix">face</i>
                                <input id="name" type="text" className="validate" />
                                <label htmlFor="name">Name</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col-md-4 col-md-offset-4">
                                <i className="material-icons prefix">account_circle</i>
                                <input id="username" type="text" className="validate" />
                                <label htmlFor="username">Username</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col-md-4 col-md-offset-4">
                                <i className="material-icons prefix">lock_outline</i>
                                <input id="password" type="password" className="validate" />
                                <label htmlFor="password">Password</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4 col-md-offset-4">
                                <a onClick={this.click} className="btn waves-effect waves-light">SIGN UP</a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

Register.propTypes = {
    toggleLogin: PropTypes.func.isRequired,
    user: PropTypes.object
};

export default Register;
