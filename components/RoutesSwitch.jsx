import React from "react";
import {Switch, Route} from "react-router-dom";

import App from "./App.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import Upload from "./Upload.jsx";

class RoutesSwitch extends React.Component {
    render() {
        return (
            <Switch>
                <Route exact path="/" component={App} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/upload" component={Upload} />
            </Switch>
        );
    }
}

export default RoutesSwitch;
