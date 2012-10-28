#!/usr/bin/env node
var express = require('express');
var http = require('http');
var socketio = require('socket.io');

var Device = require('./lib/device');
var Graph = require('./lib/graph');
var Synth = require('./lib/synth');

var app = express();
var server = http.createServer(app);
var io = socketio.listen(server);

// Web Server
app.use('/', express['static'](__dirname + '/static'));

// Web Socket Server
var synth = null;
var devices = {};
var graph = new Graph();
var pendingGraphSource;
var ids = 1;


function createClient(socket) {
    var device = new Device(ids++);
    devices[device.id] = device;
    socket.emit('registration', { id: device.id });
    socket.on('orientation', function(data) { device.emit('orientation', data); });
    socket.on('motion', function(data) { device.emit('motion', data); });
    socket.on('disconnect', function() {
        graph.removeNode(device.id);
        delete devices[device.id];
    });
    socket.on('client-type', function(type) {
        // Either 'oscillator' or 'potentiometer'
        device.type = type;
    });
    socket.on('rewire', function() {
        console.warn('rewiring', device.id);
        if(!pendingGraphSource || pendingGraphSource == device.id) {
            pendingGraphSource = device.id;
            console.info('graph source: ' + device.id.toString());
        } else {
            graph.addEdge(pendingGraphSource, device.id);
            console.info('graph connection: ' + pendingGraphSource + ' -> ' + device.id.toString());
            pendingGraphSource = null;
        }
    });
}

function createSynth(socket) {
    synth = new Synth(socket);
    socket.on('disconnect', function() {
        synth = null;
    });
}

io.sockets.on('connection', function (socket) {
    socket.on('type', function(type) {
        if (type == 'synth') {
            createSynth(socket);
        } else if (type == 'client') {
            createClient(socket);
        }
    });
});

server.listen(8000);
