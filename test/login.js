var request = require('request');

var options = {
    uri: 'http://localhost:8080/api/v-0.0/login',
    method: 'POST',
    json: {
        email: "Foo@bar.lee"
    }
};

request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body);
        /*console.log("\n");
        request(
            {uri: 'http://localhost:8080/api/v-0.0/logout', method: 'GET'},
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body);
                }
            }
        );*/
    }
});