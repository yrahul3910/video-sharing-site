# Video Sharing Website [![NSP Status](https://nodesecurity.io/orgs/dbms-project/projects/6c5f6935-88ec-4d0f-8c05-b30ebb4460f5/badge)](https://nodesecurity.io/orgs/dbms-project/projects/6c5f6935-88ec-4d0f-8c05-b30ebb4460f5)
A simple video sharing website, based on Material design, built with React, React-Router v4, Node.js and Express.js

# Table of Contents
* [Setup](#setup)
  * [Package Manager](#package-manager)
  * [Front End Libraries](#front-end-libraries)
  * [Frameworks](#frameworks)
  * [Routing](#routing)
  * [Database](#database)
  * [Search](#search)
  * [Environment Variables](#environment-variables)
  * [Security](#security)
* [React Components](#react-components)
* [Style Guides](#style-guides)
  * [ESLint Configuration](#eslint-configuration)
  * [MySQL Style Guide](#mysql-style-guide)
  * [Documentation Guide](#documentation-guide)
* [Directory Structure](#directory-structure)

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
* `SearchResults`: The search results page.
* `SettingsPage`: The personal profile page of a user where he can change his DP/background, delete videos.
* `ConfirmDelete`: The page where the user confirms deletion of his account.
* `WatchPage`: The page where the user can watch, rate, and comment on a video.
* `Comments`: All comments and replies for a video.
* `Doge`: Find out ;)
* `NewLogin`: A more modern login experience. Uses a background video taken from [Vimeo's Project Yosemite](https://vimeo.com/projectyose).

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

## Documentation Guide
Functionality that is abstracted, such as in `search.js`, should have JSDoc comments for each function. Any React components used must be added in the `React Components` section above. Block-level comments are preferred, but not required if the code is trivial. For non-trivial logic, comments should be added briefly describing the working of the code.

# Directory Structure
All videos are uploaded to the `videos` folder. The database simply stores the paths to these videos and thumbnail images. As of now, the directory structure used is `videos/<username>/<video_title>/<files>`, where the files include the video file and the thumbnail image.  

All profile pictures are stored in the `users` folder. The database stores the paths to these image files, which are served statically. The directory structure is `users/<username>/<image file>`.
