import React from "react";
import PropTypes from "prop-types";

import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";
import ThumbnailRow from "./ThumbnailRow.jsx";

class App extends React.Component {
    render() {
        let d = {
            title: "TaylorSwiftVEVO",
            thumbnails: [
                {
                    url: "/",
                    img: "https://i.ytimg.com/vi/wyK7YuwUWsU/hqdefault.jpg?sqp=-oaymwEXCPYBEIoBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCoIV0HkUg1rXW0L93DN2ChPgIBOA",
                    title: "Taylor Swift - New Romantics",
                    views: "69M",
                    channel: {
                        title: "TaylorSwiftVEVO",
                        url: "/"
                    },
                    date: "1 year ago"
                },
                {
                    url: "/1",
                    img: "https://i.ytimg.com/vi/JLf9q36UsBk/hqdefault.jpg?sqp=-oaymwEXCPYBEIoBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLAjSgDzjRalJLKk_UiOE4tw1Ue-jQ",
                    title: "Taylor Swift - Out Of The Woods",
                    views: "124M",
                    channel: {
                        title: "TaylorSwiftVEVO",
                        url: "/"
                    },
                    date: "1 year ago"
                },
                {
                    url: "/2",
                    img: "https://i.ytimg.com/vi/AgFeZr5ptV8/hqdefault.jpg?sqp=-oaymwEXCPYBEIoBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLC4UZNPeXQWZaI3LpMZ5l_sstpfFQ",
                    title: "Taylor Swift - 22",
                    views: "445M",
                    channel: {
                        title: "TaylorSwiftVEVO",
                        url: "/"
                    },
                    date: "4 years ago"
                },
                {
                    url: "/3",
                    img: "https://i.ytimg.com/vi/3tmd-ClpJxA/hqdefault.jpg?sqp=-oaymwEXCPYBEIoBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCh-ggcGnKyoQ-4f-pjnjfzDHqlSw",
                    title: "Taylor Swift - Look What You Made Me Do",
                    views: "537M",
                    channel: {
                        title: "TaylorSwiftVEVO",
                        url: "/"
                    },
                    date: "1 month ago"
                }
            ]
        };

        return (
            <div>
                <Navbar dp={this.props.user ? this.props.user.dp : "http://localhost:8000/account_circle.png"} />
                <Sidebar toggleLogin={this.props.toggleLogin} loggedIn={this.props.user ? true : false} />
                <div style={{position: "absolute", marginLeft: "350px", top: "100px"}}>
                    <ThumbnailRow data={d} />
                </div>
            </div>
        );
    }
}

App.propTypes = {
    user: PropTypes.object,
    toggleLogin: PropTypes.func.isRequired
};

export default App;
