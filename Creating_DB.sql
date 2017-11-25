DROP DATABASE IF EXISTS video_sharing;
CREATE DATABASE IF NOT EXISTS video_sharing;
USE video_sharing;

CREATE TABLE users (
    PRIMARY KEY (username),
    username   VARCHAR(30)  NOT NULL,
    name       VARCHAR(30)  NOT NULL,
    pwd        VARCHAR(100) NOT NULL,
    dp         VARCHAR(200) -- display picture
);

CREATE TABLE videos (
    PRIMARY KEY (video_id),
    video_id    INT AUTO_INCREMENT,
    description VARCHAR(200),
    upload_date DATE         NOT NULL,
    username    VARCHAR(30)  NOT NULL,
                FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE,
    title       VARCHAR(20)  NOT NULL,
    video_path  VARCHAR(100) NOT NULL,
    thumbnail   VARCHAR(200) NOT NULL
);

CREATE TABLE video_ratings (
    PRIMARY KEY (username, video_id),
    username VARCHAR(30) NOT NULL,
             FOREIGN KEY(username) REFERENCES users(username) ON DELETE CASCADE,
    video_id INT NOT NULL,
             FOREIGN KEY(video_id) REFERENCES videos(video_id) ON DELETE CASCADE,
    rating   INT NOT NULL,
             CONSTRAINT rating_in_range
             CHECK(rating IN (-1, 1))
);

CREATE TABLE comments (
    PRIMARY KEY (comment_id),
    comment_id   INT AUTO_INCREMENT,
    username     VARCHAR(30)  NOT NULL,
                 FOREIGN KEY(username) REFERENCES users(username) ON DELETE CASCADE,
    video_id     INT          NOT NULL,
                 FOREIGN KEY(video_id) REFERENCES videos(video_id) ON DELETE CASCADE,
    comment      VARCHAR(150) NOT NULL,
    comment_date DATE NOT NULL
);

CREATE TABLE replies (
    PRIMARY KEY (reply_id),
    reply_id   INT AUTO_INCREMENT,
    comment_id INT          NOT NULL,
               FOREIGN KEY(comment_id) REFERENCES comments(comment_id) ON DELETE CASCADE,
    username   VARCHAR(30)  NOT NULL,
               FOREIGN KEY(username) REFERENCES users(username) ON DELETE CASCADE,
    reply_text VARCHAR(150) NOT NULL,
    reply_date DATE NOT NULL
);

/* Users subscribe to other users */
CREATE TABLE subscriptions (
    PRIMARY KEY (username, subscriber),
    username      VARCHAR(30) NOT NULL,
                  FOREIGN KEY(username) REFERENCES users(username) ON DELETE CASCADE,
    subscriber    VARCHAR(30) NOT NULL,
                  FOREIGN KEY(subscriber) REFERENCES users(username) ON DELETE CASCADE
);

CREATE TABLE feedback (
    PRIMARY KEY (username),
    username VARCHAR(30),
             FOREIGN KEY(username) REFERENCES users(username) ON DELETE CASCADE,
    comment  VARCHAR(300) NOT NULL
);

CREATE TABLE video_views (
    PRIMARY KEY (video_id),
    video_id INT,
             FOREIGN KEY(video_id) REFERENCES videos(video_id) ON DELETE CASCADE,
    views    INT NOT NULL
);

DELIMITER //
CREATE TRIGGER before_users_insert
    BEFORE INSERT ON users
    FOR EACH ROW
BEGIN
    IF NEW.name REGEXP '[]!@#$%^&*()+\=[\{};\':"\\|,.<>/?-]' OR NEW.username REGEXP '[]!@#$%^&*()+\=[\{};\':"\\|,.<>/?-]' THEN
        SIGNAL SQLSTATE '45000' set message_text="Special characters aren't allowed in usernames and names.";
    END IF;
END //

CREATE TRIGGER subscribe_user_to_self
    AFTER INSERT ON users
    FOR EACH ROW
BEGIN
    INSERT INTO subscriptions VALUES (NEW.username, NEW.username);
END //

CREATE TRIGGER add_video_views_entry
    AFTER INSERT ON videos
    FOR EACH ROW
BEGIN
    INSERT INTO video_views VALUES (NEW.video_id, 0);
END //

CREATE PROCEDURE increment_views(IN vid_id INT)
BEGIN
    UPDATE video_views
       SET views = views + 1
     WHERE video_id = vid_id;
END //
DELIMITER ;
