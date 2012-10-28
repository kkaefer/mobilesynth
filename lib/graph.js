module.exports = Graph;
var util = require('util');

function Graph() {}
util.inherits(Graph, Array);

Graph.prototype.deleteNode = function(node) {
    this.filter(function(edge) {
        return edge[0] != node && edge[1] != node;
    });
};
