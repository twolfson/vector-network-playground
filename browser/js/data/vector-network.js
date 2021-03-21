// Load in our dependencies
const assert = require('assert');
const Path = require('./path');
const utils = require('./utils');

// Define our constructor
function VectorNetwork() {
  this.verticesCount = 0;
  this.vertices = new Float32Array(100 * 2);
  this.edgesCount = 0;
  this.edges = new Uint8Array(100 * 2);
  // TODO: Move these notes somewhere... maybe architecture decisions
  // Sooo yea... let's talk through this
  // We can have a lot of faces so it's not performant to use anything other than typed data
  // but we also don't know the length of data in theory
  // Our only good choice is to use a terminator value like in strings
  // Ugh, sounds like such a pain to iterate over...
  // Can also do something like <length, id1, id2, ...>
  // Yea, that sounds like a little bit more work to maintain but much saner for inner loops
  // There's prob another option that I'm missing at the moment
  this.faces = [];
}
VectorNetwork.prototype = {
  getNearbyVertexId: function (x, y, minimumDistance) {
    // Define our default variables
    let closestVertexId = null;
    let closestVertexDistance = Infinity;

    // Find the closest vertex
    for (let i = 0; i < this.verticesCount; i += 1) {
      // Using Euclidean distance makes the most sense
      let distance = Math.sqrt(
        Math.pow(x - this.vertices[(i * 2) + 0], 2) +
        Math.pow(y - this.vertices[(i * 2) + 1], 2));
      if (distance <= minimumDistance && distance < closestVertexDistance) {
        closestVertexDistance = distance;
        closestVertexId = i;
      }
    }

    // Return our closest vertex
    return closestVertexId;
  },

  addPath: function () {
    let pathId = this.paths.length;
    this.paths.push(new Path());
    return pathId;
  },

  addVertex: function (x, y) {
    // Resize our data to handle the new element
    let vertexId = this.verticesCount;
    this.vertices = utils.resizeArray(this.vertices, (this.verticesCount + 1) * 2);

    // Update our new location
    this.vertices[(vertexId * 2) + 0] = x;
    this.vertices[(vertexId * 2) + 1] = y;
    this.verticesCount += 1;

    // Return our id
    return vertexId;
  },
  addEdge: function (vertexId1, vertexId2) {
    // If the edge already exists, return it
    assert.notEqual(vertexId1, vertexId2, `Vertex ids are equal: ${vertexId1}, ${vertexId2}`);
    for (let i = 0; i < this.edgesCount; i += 1) {
      if ((vertexId1 === this.edges[(i * 2) + 0] && vertexId2 === this.edges[(i * 2) + 1]) ||
          (vertexId1 === this.edges[(i * 2) + 1] && vertexId2 === this.edges[(i * 2) + 0])) {
        return i;
      }
    }

    // Resize our data to handle the new element
    let edgeId = this.edgesCount;
    this.edges = utils.resizeArray(this.edges, (this.edgesCount + 1) * 2);

    // Update our new location
    this.edges[(edgeId * 2) + 0] = vertexId1;
    this.edges[(edgeId * 2) + 1] = vertexId2;
    this.edgesCount += 1;

    // Return our id
    return edgeId;
  },
  pushVertexToPath: function (pathId, x, y) {
    let vertexId = this._addVertex(x, y);
    this.pushVertexIdToPath(pathId, vertexId);
    return vertexId;
  },
  pushVertexIdToPath: function (pathId, vertexId) {
    this.paths[pathId].pushVertexId(vertexId);
  },
};

// Export our constructor
module.exports = VectorNetwork;
