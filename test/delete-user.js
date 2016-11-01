var request = require('request');

var options = {
    uri: 'http://localhost:8080/api/v-0.0/users/58179d575b230116c02e1353',
    method: 'DELETE'
};

request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body);
    }
});