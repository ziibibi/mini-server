var request = require('request');

var options = {
    uri: 'http://localhost:8080/api/v-0.0/logout',
    method: 'GET'
};

request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body);
    }
});