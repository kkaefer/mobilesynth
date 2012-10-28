function Client() {
    var client = this;
    client.socket = io.connect('http://localhost');
    client.socket.on('registration', function (data) {
        client.id = data.id;
        client.startMessaging();
    });
}

Client.prototype.startMessaging = function() {
    var client = this;
    $(window).on('devicemotion', function(evt) {
        client.socket.emit('motion', evt.originalEvent.acceleration);
    });

    $(window).on('deviceorientation', function(evt) {
        client.socket.emit('orientation', {
            alpha: evt.originalEvent.alpha,
            beta: evt.originalEvent.beta,
            gamma: evt.originalEvent.gamma
        });
    });
};
