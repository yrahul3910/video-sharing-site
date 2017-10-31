const elasticsearch = require("elasticsearch");
const esClient = new elasticsearch.Client({
    host: "127.0.0.1:9200",
    log: "error"
});

//index
function index(_index,_type, data) {
    if(_type == "user") {
        esClient.index({
            index: _index,
            type: _type,
            id: data.user_id,
            body: {
                name: data.name,
                username: data.username,
            }
        },function (error, response) {
            console.log(error);
        });
    }
    else {
        esClient.index({
            index: _index,
            type: _type,
            id: data.video_id,
            body: {
                description: data.description,
                title: data.title,
            }
        },function (error, response) {
            console.log(error);
        });

    }
}
//in the call send index name, type and JSON object with user_id,name,username
/*index("clone",
    "user",
    { "user_id": "4",
        "name": "ABCDEF",
        "username": "AB11"});
//in the call send index name, type and JSON object with video_id, description, title
index("clone",
    "video",
    { "video_id": "4",
        "description": "DESCRIBES COFFEE",
        "title": "VIDEO ON COLLEGE COFFEE"});
*/

//indices
//to check if the data is indexed properly
const indices = function indices() {
    return esClient.cat.indices({v: true})
        .then(console.log)
        .catch(err => console.error(`Error connecting to the es client: ${err}`));
};
/*const test = function test() {
    console.log("elasticsearch indices information:");
    indices();
};
test();*/

//delete
function deleteDoc(_index, _type, _id) {
    esClient.delete({
    index: _index,
    type: _type,
    id: _id
    }, function (error, response) {
            console.log(error);
    });
}
//deleteDoc('clone', 'user', 4);


//search
const search = function search(index, body) {
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

export default index;
export default indices;
export default deleteDoc;
export default search;

