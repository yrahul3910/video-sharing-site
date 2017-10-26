/* eslint-disable no-undef */
import React from "react";
import {Switch, Route} from "react-router-dom";

import App from "./App.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import Upload from "./Upload.jsx";
import Feedback from "./Feedback.jsx";
import Trending from "./Trending.jsx";
import PublicProfile from "./PublicProfile.jsx";

class RoutesSwitch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {user: null};
        this.toggleLogin = this.toggleLogin.bind(this);
    }

    componentDidMount() {
        $.post("http://localhost:8000/api/whoami", {token: localStorage.getItem("token")},
            (data) => {
                if (data.success) {
                    // The user is valid, Set state!
                    this.setState({user: data.user});
                }
            }
        );
    }

    toggleLogin(user) {
        this.setState({user});
    }

    render() {
        return (
            <Switch>
                <Route exact path="/" render={() =>
                    <App toggleLogin={this.toggleLogin} user={this.state.user} />
                } />
                <Route exact path="/login" render={() =>
                    <Login user={this.state.user} toggleLogin={this.toggleLogin} />
                } />
                <Route exact path="/register" render={() =>
                    <Register user={this.state.user} toggleLogin={this.toggleLogin} />
                } />
                <Route exact path="/upload" render={() =>
                    <Upload user={this.state.user} />
                } />
                <Route exact path="/feedback" render={() =>
                    <Feedback user={this.state.user} />
                } />
                <Route exact path="/trending" render={() =>
                    <Trending user={this.state.user} toggleLogin={this.toggleLogin} />
                } />
                <Route exact path="/profile" render={() =>
                    <PublicProfile profile={{name: "TaylorSwiftVEVO",
                        dp: "http://localhost:8000/dp.jpg",
                        background: "http://localhost:8000/back.png"}}
                    user={{dp: "http://localhost:8000/dp.jpg"}}
                    toggleLogin={this.toggleLogin} subscribers={"25,521,913"} />
                } />
            </Switch>
        );
    }
}

export default RoutesSwitch;
