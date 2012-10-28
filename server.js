#!/usr/bin/env node
var express = require('express');
var http = require('http');
var socketio = require('socket.io');

var Device = require('./lib/device');
var Graph = require('./lib/graph');

var app = express();
var server = http.createServer(app);
var io = socketio.listen(server);

// Web Server
app.use('/', express['static'](__dirname + '/static'));

// Web Socket Server
var devices = {};
var graph = new Graph();
var pendingGraphSource;
var ids = 1;
io.sockets.on('connection', function (socket) {
    var device = new Device(ids++);
    devices[device.id] = device;
    socket.emit('registration', { id: device.id });
    socket.on('orientation', function(data) { device.emit('orientation', data); });
    socket.on('motion', function(data) { device.emit('motion', data); });
    socket.on('rewire', function(data) {
    });
    socket.on('disconnect', function() { delete devices[device.id]; });
    socket.on('disconnect', function() {
        graph.deleteNode(device.id);
        delete devices[device.id];
    });
    socket.on('rewire', function() {
        console.warn('rewiring', device.id);
        if(!pendingGraphSource || pendingGraphSource == device.id) {
            pendingGraphSource = device.id;
            console.info('graph source: ' + device.id.toString());
        } else {
            graph.deleteNode(pendingGraphSource);
            graph.deleteNode(device.id);
            graph.push([pendingGraphSource, device.id]);
            console.info('graph connection: ' + pendingGraphSource + ' -> ' + device.id.toString());
            pendingGraphSource = null;
        }
    });
});

server.listen(8000);
