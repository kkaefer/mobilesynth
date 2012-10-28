function Synth() {
    var synth = this;
    synth.socket = io.connect();
    synth.socket.emit('type', 'synth');
}

