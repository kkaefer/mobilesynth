module.exports = Device;
require('util').inherits(Device, process.EventEmitter);
function Device(id) {
    var device = this;
    device.id = id;
    device.on('orientation', function(data) {
        device.orientation = data;
    });
}
