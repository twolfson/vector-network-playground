function Edge(vertexA, vertexB) {
  this.vertexA = vertexA;
  this.vertexB = vertexB;
}
Edge.prototype = {
  contains: function (vertex) {
    return this.vertexA === vertex || this.vertexB === vertex;
  },
  matches: function (edge) {
    if (this.vertexA === edge.vertexA && this.vertexB === edge.vertexB) {
      return true;
    }
    if (this.vertexA === edge.vertexB && this.vertexB === edge.vertexA) {
      return true;
    }
    return false;
  },
  other: function (vertex) {
    if (this.vertexA === vertex) {
      return this.vertexB;
    }
    if (this.vertexB === vertex) {
      return this.vertexA;
    }
    return null;
  },
};
module.exports = Edge;
