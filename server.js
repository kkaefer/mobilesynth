#!/usr/bin/env node
var express = require('express');
var http = require('http');
var socketio = require('socket.io');

var Device = require('./lib/device');


var app = express();
var server = http.createServer(app);
var io = socketio.listen(server);

// Web Server
app.use('/', express['static'](__dirname + '/static'));

// Web Socket Server
var devices = {};
var ids = 1;
io.sockets.on('connection', function (socket) {
    var device = new Device(ids++);
    devices[device.id] = device;
    socket.emit('registration', { id: device.id });
    socket.on('deviceorientation', function(data) { device.emit('orientation', data); });
    socket.on('devicemotion', function(data) { device.emit('motion', data); });
    socket.on('disconnect', function() { delete devices[device.id]; });
});

server.listen(8000);
