var express = require('express');

var app = express.createServer(express.logger());

//app.get('/', function(request, response) {
//  response.send('Hello World 2!');
//});


var fs = require('fs');
var fname = "index.html";
var iresults = function(fname){
   return (fs.readFileSync(fname))
};

var ibuffer = new Buffer(30);

//ibuffer = fs.readFileSync('index.html');
//console.log("DEBUG");
//console.log(ibuffer.toString());

app.get('/', function(request, response){
  ibuffer = fs.readFileSync('index.html');
  response.send(ibuffer.toString());
});


var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
