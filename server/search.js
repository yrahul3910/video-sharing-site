const elasticsearch = require("elasticsearch");
const esClient = new elasticsearch.Client({
    host: "127.0.0.1:9200",
    log: "error"
});

// Index new object to ElasticSearch
exports.index = (index, type, data) => {
    if(type == "user") {
        esClient.index({
            index,
            type,
            id: data.user_id,
            body: {
                name: data.name,
                username: data.username
            }
        }, (error) => {
            throw error;
        });
    }
    else {
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
exports.deleteDoc = (index, type, id) => {
    esClient.delete({
        index,
        type,
        id
    }, (error) => {
        throw error;
    });
};

// Search for documents
exports.search = (index, body) => {
    return esClient.search({index: index, body: body});

};
/*
//put the following function in the server calling search
const test = function test(str) {
    let body = {
            size: 10,
            from: 0,
            query: {
                    multi_match: {
                    query: str,
                    fields: ['username', 'name', 'description', 'title'],
                    minimum_should_match: 1,//3
                    fuzziness: 1
                    }
            }
    };

    console.log(`retrieving documents whose title or authors match '${body.query.multi_match.query}' (displaying ${body.size} items at a time)...`);
    search('clone' , body)
    .then(results => {
    console.log(`found ${results.hits.total} items in ${results.took}ms`);
    if (results.hits.total > 0) console.log(`returned titles:`);
            results.hits.hits.forEach((hit,index) => console.log(hit));
    })
    .catch(console.error);
};

test('ABCDEF');
*/

module.exports = exports;

