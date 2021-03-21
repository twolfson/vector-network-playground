function Edge(vertexA, vertexB) {
  this.vertexA = vertexA;
  this.vertexB = vertexB;
}
Edge.prototype = {
  matches: function (edge) {
    if (this.vertexA === edge.vertexA && this.vertexB === edge.vertexB) {
      return true;
    }
    if (this.vertexA === edge.vertexB && this.vertexB === edge.vertexA) {
      return true;
    }
    return false;
  }
};
module.exports = Edge;
