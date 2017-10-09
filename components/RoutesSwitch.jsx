import React from "react";
import {Switch, Route} from "react-router-dom";

import App from "./App.jsx";
import Login from "./Login.jsx";

class RoutesSwitch extends React.Component {
    render() {
        return (
            <Switch>
                <Route exact path="/" component={App} />
                <Route exact path="/login" component={Login} />
            </Switch>
        );
    }
}

export default RoutesSwitch;
