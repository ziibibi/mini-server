var request = require('request');

var rand = Math.round(Math.random() * 0xFFFF).toString(16);
var options = {
    uri: 'http://localhost:8080/api/v-0.0/users',
    method: 'POST',
    json: {
        first_name: "John-"+rand,
        last_name: "Foo-bar-lee-"+rand,
        email: "john"+rand+"@foo.bar"
    }
};

request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body);
    }
});