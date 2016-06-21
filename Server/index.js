// Author: Deen Aariff
// Date: Tues March 22, 2016
// Description: Main app
// Dependendencies: Express, Cors, Body-Parser, MongoDB, Multer, MongoJs, Morgan

var express = require('express');
var app = express();
var http = require('http')
var server = http.createServer(app)

// app Dependencies
var dep = {
	path: require('path'),
	mongodb: require("mongodb"),
	mongojs: require('mongojs'),
	config: require('./config')
}

// Database Instantiation with MongoJs
var db = dep.mongojs('mongodb://127.0.0.1:27017/RubiksCubeDBAariffDeen',['users'])

// Initialize other dependencies
var dbFuncts = require('./dbModules/dbfunctions');
var io = require('socket.io').listen(server)
var SocketIO = require('./SocketIO/socket.js');
SocketIO.init(db,dbFuncts);
SocketIO.listen(io);

// Use Express
app.use(express.static('./Client/'))

// Handles Users
app.get('/', function(req, res) {
		res.sendFile(__dirname + '/index.html');
});

// app Start Function
function start () {
	console.log("Running app Configurations...")
	dbFuncts.init(db,dep.mongodb.ObjectId);
	var port = process.env.PORT || dep.config.port;
	server.listen(port);
  console.log("app listening on port %d", port);
}

start();
