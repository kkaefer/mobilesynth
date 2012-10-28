function Client() {
    var client = this;

    $('body').on('touchmove', function(e) { e.preventDefault(); });

    client.resetConfiguration();

    client.socket = io.connect();
    client.socket.on('registration', function (data) {
        client.id = data.id;
        client.startMessaging();
        client.setupUI();
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

Client.prototype.setupUI = function() {
    var client = this;
    $('#type').change(function(evt) {
        client.resetConfiguration();
    });

    $('#connect').on('touchstart', function() {
        client.socket.emit('connect-control');
    });

    var potentiometerValue = $('#ui-potentiometer-value');
    $(window).on('deviceorientation', function(evt) {
        potentiometerValue.text(evt.originalEvent.alpha.toFixed(1) + 'º');
    });
};

Client.prototype.resetConfiguration = function() {
    var client = this;
    client.type = $('#type').val();

    $('.pane').hide();
    if (client.type == 'potentiometer') {
        $('#ui-potentiometer').show();
    }
};
