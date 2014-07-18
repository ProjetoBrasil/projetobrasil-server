//Example POST method invocation
var Client = require('node-rest-client').Client;

var client = new Client();

// set content-type header and data as json in args parameter
var args = {
  data: { test: "hello" },
  headers:{"Content-Type": "application/json"} 
};

client.post("http://api.projetobrasil.org:4242/v1/politician", args, function(data,response) {
      // parsed response body as js object
    console.log(data);
    // raw response
    console.log(response);
});