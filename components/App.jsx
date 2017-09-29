import React from "react";

import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";

class App extends React.Component {
    render() {
        return (
            <div>
                <Navbar dp="https://d1wn0q81ehzw6k.cloudfront.net/additional/thul/media/0eaa14d11e8930f5?w=400&h=400" />
                <Sidebar />
            </div>
        );
    }
}

export default App;
