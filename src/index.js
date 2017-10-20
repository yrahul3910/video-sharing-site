/* eslint-disable no-undef */
// App entry point
import "./index.sass";
import React from "react";
import ReactDOM from "react-dom";
import {HashRouter as Router} from "react-router-dom";

import RoutesSwitch from "../components/RoutesSwitch.jsx";

ReactDOM.render(
    <Router>
        <RoutesSwitch />
    </Router>, document.getElementById("app")
);
