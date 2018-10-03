// Dependancies
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const fs = require('fs');
const config = require('./config');


// All the server Logic for both the http and https server
const unifiedServer = function (req, res) {
    // Get the url and parse it
    const parsedURL = url.parse(req.url, true);

    // Get the path from that url
    const path = parsedURL.pathname;

    // Get the HTTP Method
    const method = req.method.toLowerCase();

    // Get the query string as an object
    const queryStringObject = parsedURL.query;

    // Get the headers as an object
    const headers = req.headers;

    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Get the payload if any
    var decoder = new StringDecoder();
    let buffer = '';

    req.on('data', () => {
        buffer += decoder.write(data);
    });

    req.on('end', () => {
        buffer += decoder.end();

        // Choose the handler this request should go to
        const choosenHandler =
            typeof router[trimmedPath] !== 'undefined' ?
            router[trimmedPath] :
            handlers.notFound;

        // Construct the data object
        const data = {
            trimmedPath,
            queryStringObject,
            method,
            headers,
            payload: buffer
        };

        // Route the request to the specified handler in the router
        choosenHandler(data, (statusCode, payload) => {
            // Use the status code called back by the handler, or default
            statusCode = typeof statusCode == 'number' ? statusCode : 200;

            // Use the payload called back by the handler or default to ana empty object
            // payload = typeof payload == 'object' ? payload : {};
            payload = {
                greeting: "Hello World"
            };

            // Convert the payload to String
            const payloadstring = JSON.stringify(payload);

            // Return the response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadstring);
        });
    });
}

// Define the handlers
const handlers = {};

// Sample handler
handlers.hello = (data, callback) => {
    // Callback a http status code, and a payload object
    callback(200);
};

// Not Found handler
handlers.notFound = (data, callback) => {
    callback(404);
};

// Define a request router
const router = {
    ping: handlers.hello
};


// Instantiate the HTTPSserver
const httpServer = http.createServer((req, res) => {
    unifiedServer(req, res);
});

// Start a server and make listen to port 3011
httpServer.listen(config.httpPort, () => {
    console.log(`The server is listening on port ${config.httpPort}`);
});