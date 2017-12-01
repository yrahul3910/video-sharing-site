/* eslint-disable no-undef */
import React from "react";
import {Link, Redirect} from "react-router-dom";
import PropTypes from "prop-types";

class NewLogin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loggedIn: (this.props.user ? true : false)};
        this.click = this.click.bind(this);
    }

    click() {
        $.post("http://localhost:8000/api/authenticate", {
            username: $("#username").val(),
            password: $("#password").val()
        }, (data) => {
            if (!data.success)
                Materialize.toast("Please check your details and try again.", 3000, "rounded");
            else {
                localStorage.setItem("token", data.token);
                this.props.toggleLogin(data.user);
                this.setState({loggedIn: true});
            }
        });
    }

    componentDidMount() {
        $(".background-video")[0].play();
    }

    render() {
        if (this.state.loggedIn)
            return (
                <Redirect to="/" />
            );

        return (
            <div style={{width: "100vw", height: "100vh"}}>
                <video className="background-video" loop="true">
                    <source src="https://vimeo-hp-videos.global.ssl.fastly.net/0/0-vp9.webm" type="video/webm" />
                    <source src="https://vimeo-hp-videos.global.ssl.fastly.net/3/3-vp9.webm" type="video/webm" />
                    <source src="https://vimeo-hp-videos.global.ssl.fastly.net/3/3-vp8.webm" type="video/webm" />
                </video>
                <div style={{height: "64px", display: "flex", justifyContent: "flex-start"}}>
                    <Link to="/">
                        <p href="#" style={{bottom: "25px", fontSize: "32px", fontWeight: "lighter",
                            position: "relative", color: "white", marginLeft: "15px"}}>
                            OpenVideo
                        </p>
                    </Link>
                </div>
                <div className="center" style={{display: "flex", flexDirection: "column",
                    position: "absolute", width: "40%", top: "100px", background: "rgba(0, 0, 0, 0.6)",
                    color: "#ccc"}}>
                    <p style={{color: "white"}}>Enter your sign-in credentials</p>
                    <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                        <form className="search-bar" style={{height: "50px", width: "75%"}}>
                            <input type="text" className="no-material search-input search-login"
                                id="username" placeholder="Username" />
                        </form>
                        <form className="search-bar" style={{height: "50px", width: "75%"}}>
                            <input type="password" className="no-material search-input search-login"
                                id="password" placeholder="Password" />
                        </form>
                        <a style={{marginTop: "20px", marginBottom: "20px", width: "75%"}}
                            onClick={this.click} className="btn waves-effect waves-light green">
                            Login
                        </a>
                        <a href="https://vimeo.com/projectyose" style={{color: "gray", marginBottom: "20px"}}>Video source: Project Yosemite</a>
                    </div>
                </div>
            </div>
        );
    }
}

NewLogin.propTypes = {
    user: PropTypes.object,
    toggleLogin: PropTypes.func.isRequired
};

export default NewLogin;
