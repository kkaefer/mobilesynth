module.exports = Device;
require('util').inherits(Device, process.EventEmitter);
function Device(id) {
    this.id = id;

    this.on('motion', this.onmotion.bind(this));
    this.on('orientation', this.onorientation.bind(this));
}

Device.prototype.onmotion = function(data) {
    console.warn('motion', data);
};

Device.prototype.onorientation = function(data) {
    console.warn('orientation', data);
};
