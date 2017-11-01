# Video Sharing Website [![NSP Status](https://nodesecurity.io/orgs/dbms-project/projects/6c5f6935-88ec-4d0f-8c05-b30ebb4460f5/badge)](https://nodesecurity.io/orgs/dbms-project/projects/6c5f6935-88ec-4d0f-8c05-b30ebb4460f5)
A simple video sharing website, based on Material design, built with React, React-Router v4, Node.js and Express.js

# Table of Contents
* [Setup](#setup)
  * [Package Manager](#package-manager)
  * [Front End Libraries](#front-end-libraries)
  * [Frameworks](#frameworks)
  * [Routing](#routing)
  * [Database](#database)
  * [Environment Variables](#environment-variables)
* [React Components](#react-components)
* [Style Guides](#style-guides)
  * [ESLint Configuration](#eslint-configuration)
  * [MySQL Style Guide](#mysql-style-guide)
* [Video Directory Structure](#video-directory-structure)
* [TODOs](#todos)

# Setup
## Package Manager
Yarn is the package manager of choice. To use this repository, run `yarn` to install all required packages. 

## Front End Libraries
The code uses [jQuery](www.jquery.com) and [Materialize CSS](www.materializecss.com).

## Frameworks
React is used for building the front end. The project is configured with Babel and Webpack for transpiling code to vanilla JS.  

Express is the web server used in the back end, which uses Node.js.

## Routing
React-Router v4's `HashRouter` is used for client-side routing. The server doesn't handle dynamic requests, and only implements the API request handling.  

## Database
MariaDB (MySQL) is used as the database. `Creating_DB.sql` is initially run to set up the database. All database queries are separated into `db.js`. The server uses this to perform queries and get results.  

## Search
ElasticSearch is used for search functionality. The `search.js` file provides an abstraction to all searching functions, like indexing new documents, searching, and deleting indices.

## Environment Variables
The `.env` file should contain the following variables:
* `SESSION_SECRET`: Ideally a random string, used by JWTs for session management.
* `DB_USER`: The username of the database user.
* `DB_PWD`: The database password.
* `DB_HOST`: The hostname of the database.

## Security
Node Security Platform (NSP) is used to check for vulnerabilities in the package dependencies. Helmet.js is used to prevent XSS attacks.

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
* `Feedback`: The feedback form page, including the navbar
* `Trending`: The page showing the trending videos
* `TrendingVideo`: A row showing details of one video in the trending page.
* `PublicProfile`: The publicly visible profile page for a user.

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
All videos are uploaded to the `videos` folder. The database simply stores the paths to these videos and thumbnail images. To simplify implementation, the site only supports uploads by users, and users can subscribe to other users. This makes certain aspects of implementation easier.  

As of now, the directory structure used is `videos/<user_id>/<video_title>/<files>`, where the files include the video file and the thumbnail image.  

# TODOs
* `Trending.jsx: 36`: 
> This should also render a Link component to link to the actual video.  

Clicking on the title should link to the video, and similarly, clicking the name of the uploader should link to the public profile page.

* `PublicProfile.jsx:50`:
> The data sent from user should have name, background, dp and subscribers as fields.

The server should handle GET requests to the URL, and send these as properties of the object.
