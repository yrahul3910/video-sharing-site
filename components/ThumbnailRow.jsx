import React from "react";
import PropTypes from "prop-types";

class ThumbnailRow extends React.Component {
    /*
        props:
            data: An object that has a title and an array, thumbnails.
                        The array has 4 elements only.
                {
                    "title": "Title of the row",
                    "thumbnails": [
                        {
                            url: (string) URL of the video,
                            img: (string) base64 encoding of thumbnail,
                            title: (string) Title of video,
                            views: (string) views of the video,
                            channel: {
                                title: "Name of the channel",
                                url: "Link to channel"
                            },
                            date: (string) Date like (x months/days/hours ago)
                        }
                    ]
                }
    */
    render() {
        let innerDivs = this.props.data.thumbnails.map((t) =>
            <div className="col s3" key={t.url}>
                <div className="row">
                    <img className="thumbnail" src={t.img} />
                </div>
                <div className="row">
                    <a href={t.url} style={{color: "black"}}>
                        {t.title}
                    </a>
                </div>
                <div className="row">
                    <a className="thumbnail-channel" href={t.channel.url}>
                        {t.channel.title}
                    </a>
                </div>
                <div className="row">
                    <p className="thumbnail-channel">
                        {`${t.views} views • ${t.date}`}
                    </p>
                </div>
            </div>
        );
        return (
            <div>
                <div className="row">
                    {this.props.data.title}
                </div>
                <div className="row">
                    {innerDivs}
                </div>
            </div>
        );
    }
}

ThumbnailRow.propTypes = {
    data: PropTypes.object.isRequired
};

export default ThumbnailRow;
