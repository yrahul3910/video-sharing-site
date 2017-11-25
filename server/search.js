const elasticsearch = require("elasticsearch");
const esClient = new elasticsearch.Client({
    host: "127.0.0.1:9200",
    log: "error"
});

// Index new object to ElasticSearch
exports.index = (index, type, data) => {
    /*if(type == "user") {
        esClient.index({
            index,
            type,
            id: data.username,
            body: {
                name: data.name,
                username: data.username
            }
        }, (error) => {
            if (error)
                throw error;
        });
    } */
    if (type == "video") {
        esClient.index({
            index,
            type,
            id: data.video_id,
            body: {
                description: data.description,
                title: data.title,
                username: data.username,
                thumbnail: data.thumbnail
            }
        }, (error) => {
            if (error)
                throw error;
        });
    }
};

// Get all the indices from ElasticSearch
exports.indices = () => {
    return esClient.cat.indices({v: true})
        .then(console.log) // eslint-disable-line no-console
        .catch(err => {
            throw err;
        });
};

// Delete document from index
exports.deleteDoc = (index, type, id, func) => {
    esClient.delete({
        index,
        type,
        id
    }, () => {
        func();
    });
};

// Search for documents
exports.search = (index, body) => {
    return esClient.search({index, body});
};

module.exports = exports;

