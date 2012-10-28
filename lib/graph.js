module.exports = Graph;
var util = require('util');

function Graph() {
    this.edges = [];
}

Graph.prototype.addEdge = function(source, target) {
    this.edges.push([source, target]);
    console.log(this.edges);
};

Graph.prototype.removeNode = function(node) {
    this.edges = this.edges.filter(function(edge) {
        return edge[0] != node && edge[1] != node;
    });
};

Graph.prototype.serialize = function() {
    return this.edges;
};