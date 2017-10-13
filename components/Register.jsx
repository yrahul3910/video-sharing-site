/* eslint-disable no-undef */
import React from "react";
import PropTypes from "prop-types";

import Navbar from "./Navbar.jsx";

class Register extends React.Component {
    /*
        props:
            toggleLogin: Function that is called when user is done registering
    */
    constructor(props) {
        super(props);
        this.click = this.click.bind(this);
    }

    click() {
        let name = $("#name").val();
        let username = $("#username").val();
        $.post("http://localhost:8000/api/register", {
            username,
            password: $("#password").val(),
            name,
        }, (data) => {
            if (!data.success)
                $("#message").html("<span style='color: red'>Username already exists!</span>");
            else {
                $("#message").html("<span style='color: green'>Success!</span>");
                this.props.toggleLogin({
                    name,
                    username
                });

                localStorage.setItem("token", data.token);
            }
        });
    }

    render() {
        return (
            <div>
                <Navbar dp="https://d1wn0q81ehzw6k.cloudfront.net/additional/thul/media/0eaa14d11e8930f5?w=400&h=400" />
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
                                <a className="btn waves-effect waves-light">SIGN UP</a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

Register.propTypes = {
    toggleLogin: PropTypes.func.isRequired
};

export default Register;
