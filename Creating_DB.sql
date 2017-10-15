DROP DATABASE IF EXISTS video_sharing;
CREATE DATABASE IF NOT EXISTS video_sharing;
USE video_sharing;

CREATE TABLE users (
    PRIMARY KEY (user_id),
    user_id  INT AUTO_INCREMENT,
    name     VARCHAR(30)  NOT NULL,
    username VARCHAR(30)  NOT NULL,
    pwd      VARCHAR(100) NOT NULL,
    dp       VARCHAR(200) -- display picture
);

CREATE TABLE videos (
    PRIMARY KEY (video_id),
    video_id    INT AUTO_INCREMENT,
    description VARCHAR(200),
    upload_date DATE         NOT NULL,
    user_id     INT          NOT NULL,
    title       VARCHAR(20)  NOT NULL,
    views       INT          NOT NULL,
                CONSTRAINT views_positive
                CHECK(views > 0),
    channel_id  INT,
    video_path  VARCHAR(100) NOT NULL,
    thumbnail   VARCHAR(200) NOT NULL
);

CREATE TABLE video_ratings (
    PRIMARY KEY (user_id, video_id),
    user_id  INT NOT NULL,
             FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    video_id INT NOT NULL,
             FOREIGN KEY(video_id) REFERENCES videos(video_id) ON DELETE CASCADE,
    rating   INT NOT NULL,
             CONSTRAINT rating_in_range
             CHECK(rating IN (-1, 1))
);

CREATE TABLE comments (
    PRIMARY KEY (comment_id),
    comment_id INT AUTO_INCREMENT,
    user_id    INT          NOT NULL,
               FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    video_id   INT          NOT NULL,
               FOREIGN KEY(video_id) REFERENCES videos(video_id) ON DELETE CASCADE,
    comment    VARCHAR(150) NOT NULL
);

CREATE TABLE replies (
    PRIMARY KEY (reply_id),
    reply_id   INT AUTO_INCREMENT,
    comment_id INT          NOT NULL,
               FOREIGN KEY(comment_id) REFERENCES comments(comment_id) ON DELETE CASCADE,
    user_id    INT          NOT NULL,
               FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    reply_text VARCHAR(150) NOT NULL
);

CREATE TABLE channels (
    PRIMARY KEY (channel_id),
    channel_id     INT AUTO_INCREMENT,
    name           VARCHAR(30) NOT NULL,
    user_id        INT         NOT NULL,
                   FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    dp             VARCHAR(200), -- display picture
    background_pic VARCHAR(200)
);

CREATE TABLE subscriptions (
    PRIMARY KEY (channel_id, user_id),
    channel_id INT NOT NULL,
               FOREIGN KEY(channel_id) REFERENCES channels(channel_id) ON DELETE CASCADE,
    user_id    INT NOT NULL,
               FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE playlists (
    PRIMARY KEY (playlist_id),
    playlist_id INT AUTO_INCREMENT,
    user_id     INT NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    name        VARCHAR(30) NOT NULL
);

/* A table storing the index of a video in a playlist. */
CREATE TABLE playlist_videos (
    PRIMARY KEY (playlist_id, video_id),
    playlist_id INT NOT NULL,
                FOREIGN KEY(playlist_id) REFERENCES playlists(playlist_id) ON DELETE CASCADE,
    video_id    INT NOT NULL,
                FOREIGN KEY(video_id) REFERENCES videos(video_id) ON DELETE CASCADE,
    video_index INT NOT NULL
);

