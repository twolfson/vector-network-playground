// Load in our dependencies
const Path = require('./path');
const utils = require('./utils');

// Define our constructor
function VectorNetwork() {
  this.verticesCount = 0;
  this.vertices = new Float32Array(0);
  this.paths = [];
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
          Math.pow(x - this.vertices[i*2 + 0], 2) +
          Math.pow(y - this.vertices[i*2 + 1], 2));
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

  _addVertex: function (x, y) {
    // Resize our data to handle the new element
    let vertexId = this.verticesCount;
    this.vertices = utils.resizeArray(this.vertices, (this.verticesCount + 1) * 2);

    // Update our new location
    this.vertices[vertexId*2 + 0] = x;
    this.vertices[vertexId*2 + 1] = y;
    this.verticesCount += 1;

    // Return our id
    return vertexId;
  },
  pushVertexToPath: function (pathId, x, y) {
    let vertexId = this._addVertex(x, y);
    this.paths[pathId].pushVertexId(vertexId);
    return vertexId;
  }
};

// Export our constructor
module.exports = VectorNetwork;
