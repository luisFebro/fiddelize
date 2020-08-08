const http = require("http");
// reference: https://stackoverflow.com/questions/38533580/nodejs-how-to-promisify-http-request-reject-got-called-two-times

function httpRequest(params, postData) {
    return new Promise(function(resolve, reject) {
        const clientRequest = http.request(params, function(res) {
            // reject on bad status
            if (res.statusCode < 200 || res.statusCode >= 300) {
                return reject(new Error('statusCode=' + res.statusCode));
            }

            // cumulate data
            let body = [];
            res.on('data', function(chunk) {
                body.push(chunk);
            });
            // resolve on end
            res.on('end', function() {
                try {
                    body = JSON.parse(Buffer.concat(body).toString());
                } catch(e) {
                    reject(e);
                }
                resolve(body);
            });
        });

        // reject on request error
        clientRequest.on('error', function(err) {
            // This is not a "Second reject", just a different sort of failure
            reject(err);
        });

        if (postData) {
            req.write(postData);
        }
        // IMPORTANT
        clientRequest.end();
    });
}

module.exports = httpRequest;

/*
var params = {
    host: '127.0.0.1',
    port: 4000,
    method: 'GET',
    path: '/api/v1/service'
};
// this is a get, so there's no post data

httpRequest(params).then(function(body) {
    console.log(body);
});
And these promises can be chained, too...

httpRequest(params).then(function(body) {
    console.log(body);
    return httpRequest(otherParams);
}).then(function(body) {
    console.log(body);
    // and so on
});
 */