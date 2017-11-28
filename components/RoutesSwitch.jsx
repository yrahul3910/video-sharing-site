/* eslint-disable no-undef */
import React from "react";
import {Switch, Route} from "react-router-dom";

import App from "./App.jsx";
import Login from "./Login.jsx";
import NewLogin from "./NewLogin.jsx";
import Register from "./Register.jsx";
import Upload from "./Upload.jsx";
import Feedback from "./Feedback.jsx";
import Trending from "./Trending.jsx";
import PublicProfile from "./PublicProfile.jsx";
import SearchResults from "./SearchResults.jsx";
import SettingsPage from "./SettingsPage.jsx";
import ConfirmDelete from "./ConfirmDelete.jsx";
import WatchPage from "./WatchPage.jsx";
import Doge from "./Doge.jsx";

class RoutesSwitch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {user: {}};
        this.toggleLogin = this.toggleLogin.bind(this);
    }

    componentDidMount() {
        $.post("http://localhost:8000/api/whoami", {token: localStorage.getItem("token")},
            (data) => {
                if (data.success) {
                    // The user is valid, Set state!
                    this.setState({user: data.user});
                } else
                    this.setState({user: null});
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
                <Route exact path="/login/new" render={() =>
                    <NewLogin user={this.state.user} toggleLogin={this.toggleLogin} />
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
                <Route exact path="/profile/:user" render={(props) =>
                    <PublicProfile user={this.state.user}
                        toggleLogin={this.toggleLogin} {...props} />
                } />
                <Route exact path="/search/:q" render={(props) =>
                    <SearchResults user={this.state.user}
                        toggleLogin={this.toggleLogin} {...props} />
                } />
                <Route exact path="/me" render={() =>
                    <SettingsPage user={this.state.user}
                        toggleLogin={this.toggleLogin} />
                } />
                <Route exact path="/confirm_delete" render={() =>
                    <ConfirmDelete user={this.state.user}
                        toggleLogin={this.toggleLogin} />
                } />
                <Route exact path="/watch/:id" render={(props) =>
                    <WatchPage user={this.state.user} {...props} />
                } />
                <Route exact path="/suchempty" render={() =>
                    <Doge user={this.state.user} toggleLogin={this.toggleLogin} />
                } />
            </Switch>
        );
    }
}

export default RoutesSwitch;
