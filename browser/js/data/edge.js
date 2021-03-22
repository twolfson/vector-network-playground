// Define id tracking singletons
// DEV: Use non-zero starting value so `if` checks are easier
let EDGE_ID = 1;

function Edge(vertexA, vertexB) {
  this.vertexA = vertexA;
  this.vertexB = vertexB;
  this.id = EDGE_ID++;
}
Edge.resetCounter = function () {
  EDGE_ID = 1;
};
Edge.prototype = {
  contains: function (vertex) {
    return this.vertexA === vertex || this.vertexB === vertex;
  },
  matches: function (vertexC, vertexD) {
    if (this.vertexA === vertexC && this.vertexB === vertexD) {
      return true;
    }
    if (this.vertexA === vertexD && this.vertexB === vertexC) {
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
