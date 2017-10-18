# Video Sharing Website
A simple video sharing website, based on Material design, built with React, React-Router v4, Node.js and Express.js

# Table of Contents
* [Setup](#setup)
  * [Environment Variables](#environment-variables)
* [React Components](#react-components)
* [Style Guides](#style-guides)
  * [ESLint Configuration](#eslint-configuration)
  * [MySQL Style Guide](#mysql-style-guide)
* [Video Directory Structure](#video-directory-structure)

# Setup
To use this repository, run `yarn` to install all required packages. The code uses [jQuery](www.jquery.com) and [Materialize CSS](www.materializecss.com).  

This project is configured with Babel and Webpack for transpiling code to vanilla JS.  

React-Router v4's `HashRouter` is used for client-side routing. The server doesn't handle dynamic requests, and only implements the API request handling.  

All database queries are separated into `db.js`. The server uses this to perform queries and get results. `express-session` is used for session management, along with JWTs.  

Mocha is used as the testing framework, along with Chai as the assertion library. Files used for running tests end in `.test.js`. The `server/testSetup.js` file is used so Mocha can understand the newer ES6 syntax (example: using `import`) 

## Environment Variables
The `.env` file should contain the following variables:
* `SESSION_SECRET`: Ideally a random string, used by `express-session` for session management.
* `DB_USER`: The username of the database user.
* `DB_PWD`: The database password.
* `DB_HOST`: The hostname of the database.

# React Components
The React components used are below:
* `App`: The home page component.
* `Navbar`: The navbar at the top of the site
* `Sidebar`: The sidebar shown in the homepage
* `ThumbnailRow`: A row shown in the home page, with a set of related thumbnails. These could be grouped in various ways--by some channel the user subscribes to, most recently uploaded, etc.
* `RoutesSwitch`: The top-level component rendered.
* `Login`: The login page component
* `Register`: The register page component
* `Upload`: The page where the user uploads a video to the server
* `VideoSelectCard`: A card shown in the upload page to select a video file
* `VideoUploadCard`: A card shown in the upload page after a file is selected

# Style Guides

## ESLint Configuration
ESLint is configured for the following rules:
* Double quotes preferred over single quotes
* Indents are 4 spaces
* Line breaks are LF
* Semicolons are a must
* Console statements are warnings

## MySQL Style Guide
The style guide at [this link](http://www.sqlstyle.guide/) is used and followed in this project.

# Video Directory Structure
All videos are uploaded to the `videos` folder. The database simply stores the paths to these videos and thumbnail images. As of now, the site only supports uploads by individual users, but later should support uploads by channels as well.  

As of now, the directory structure used is `videos/<user_id>/<video_title>/<files>`, where the files include the video file and the thumbnail image.  

A possible solution to saving channel videos is by noticing how channels are created by users. Thus, we could have a folder, `independent_videos`, for videos by a user, and other folders by channel name, all inside the `<user_id>` folder.
