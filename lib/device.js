module.exports = Device;
require('util').inherits(Device, process.EventEmitter);
function Device(id) {
    this.id = id;
}

Device.prototype.ondevicemotion = function(data) {

};

Device.prototype.ondeviceorientation = function(data) {

};
