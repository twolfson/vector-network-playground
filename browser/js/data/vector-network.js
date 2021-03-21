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
  this.facesCount = 0;
  this.faces = new Uint8Array(100 * 8 /* Impossible to guess length so doing our best */);
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

    // Update our faces
    this.updateFaces(vertexId1, vertexId2);

    // Return our id
    return edgeId;
  },
  updateFaces: function (vertexId1, vertexId2) {
    // TODO: Clean up code comment
    // Trying to glean a decent strategy from this: https://github.com/furnishup/blueprint3d/blob/cac8b62c1a3839e929334bdc125bf8a74866be9e/src/model/floorplan.ts#L369-L494
    // 1. Find all possible smallest faces - smallest by performing BFS then prioritizing smallest angles
    // 2. Remove duplicate faces with different starting edge (cycles room, hashes into `id1-id2-id3-...`)
    // 3. Remove clockwise faces (since all faces will have both clockwise and counter-clockwise variants)
    // 4. Disco
    // TODO: How do we identify when we subdivide a face so we can persist the fills?
    //   They don't do that in blueprint3d
    //   Something about new face with all edges except new edge being contained by an existing face?
    // TODO: Use dynamically sized array
    let adjacentVertexIds = new Uint8Array(100 * 8);
    // DEV: Ideally would use boolean field but this is the simplest we've got
    let seenVertexIds = new Uint8Array(this.verticesCount);
    for (let vertexId = 0; vertexId < this.verticesCount; vertexId += 1) {
      // Find all adjacent vertices
      let adjacentVertexIdsIndex = 0;
      adjacentVertexIds.fill(0); // Not necessary but nice to indicate data reset

      for (let edgeId = 0; edgeId < this.edgesCount; edgeId += 1) {
        if (this.edges[(edgeId * 2) + 0] === vertexId) {
          adjacentVertexIds[adjacentVertexIdsIndex] = this.edges[(edgeId * 2) + 1];
          adjacentVertexIdsIndex += 1;
        } else if (this.edges[(edgeId * 2) + 1] === vertexId) {
          adjacentVertexIds[adjacentVertexIdsIndex] = this.edges[(edgeId * 2) + 0];
          adjacentVertexIdsIndex += 1;
        }
      }
    }
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
