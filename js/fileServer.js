// create the server (app), fileManager, and socket (io) modules
var app = require('http').createServer(appHandler);
var io = require('socket.io').listen(app);
var fileManager = require('./fileManager.js');
var fm = new fileManager.fileManager();

// listen to port 8080
app.listen(8080, 'localhost');

// has to be before because this a runtime function declared at runtime
// and will not be initialized as a Function object before we use it in
// app.createServer; therefore, we have to put it before anything the
// type is guaranteed and nodejs does not complain about passing in 
// something that is not a function.
var connectionHandler = function(socket)
{
	console.log("connection received");

	// connect to the signal handlers of the socket
	// message
	// disconnect
	// error
	socket.on('message', sMessageHandler);
	socket.on('disconnect', sDisconnectHandler);
	socket.on('error', sErrorHandler);
}

// Set up connection handler for the websocket
io.sockets.on('connection', connectionHandler);

// If this is declared as a variable it will not work, i.e var appHandler = function.
// Im assuming its a bug with node.
function appHandler(request, response)
{
	// check if the request is a POST request if we setup the webhook api with the github
	// repo. When push requests are made to the main branch that hosts the production scss
	// then emit a signal to update the user if he/she wishes to, as they might be in the middle
	// of changes. Maybe have a button available to them so that they can decide to update when 
	// they are ready, and the updates will get merged with their changes (ideally).
	// console.log(request);
	// console.log("We are not implementing this server; we are just using it for websockets.");
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write("sorry not implemented; email balshamali@bloomberg.net")
	// var body = '<!DOCTYPE html> <html> <head> <script src="http://localhost:8888/serve/socket.io.js"></script> <script> var socket = io.connect("http://127.0.0.1:8080"); socket.on("news", function (data) {console.log(data); socket.emit("my other event", { my: "data" }); }); </script> </head> <body> <h1> Hey there </h1> </body> </html>';
	// '<head> <script src="/socket.io.js"></script> <script> var socket = io.connect("http://localhost:8888"); socket.on("news", function (data) {console.log(data); socket.emit("my other event", { my: "data" }); }); </script> </head> <body> <p> Hey there </p> </body> ';
	// response.write(body);
    response.end();
}

function sMessageHandler(data, fn)
{
	console.log('message received: ', data);
	// whatever the message is, always retrieveFileNames for now
	fm.retrieveFileNames();
}

function sDisconnectHandler(reason)
{
	console.log('socket disconnected reason: ', reason);
}

function sErrorHandler(err)
{
	console.log('error: ', err)	
}

// testing fm module
// fm.retrieveFileNames();
