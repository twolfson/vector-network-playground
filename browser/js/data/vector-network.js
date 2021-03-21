// Load in our dependencies
const assert = require('assert');
const Path = require('./path');
const utils = require('./utils');

// Define our constructor
function VectorNetwork() {
  this.verticesCount = 0;
  this.vertices = new Float32Array(100 * 2);
  // DEV: Edges stores both directions to simplify iteration and logic checks
  this.edgesCount = 0;
  this.edges = new Uint8Array(100 * 4);
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
      for (let j = 0; j < 2; j += 1) {
        if (vertexId1 === this.edges[(i * 4) + (j * 2) + 0] && vertexId2 === this.edges[(i * 4) + (j * 2) + 1]) {
          return i;
        }
      }
    }

    // Resize our data to handle the new element
    let edgeId = this.edgesCount;
    this.edges = utils.resizeArray(this.edges, (this.edgesCount + 1) * 4);

    // Update our new location
    this.edges[(edgeId * 4) + (0 * 2) + 0] = vertexId1;
    this.edges[(edgeId * 4) + (0 * 2) + 1] = vertexId2;
    this.edges[(edgeId * 4) + (1 * 2) + 0] = vertexId2;
    this.edges[(edgeId * 4) + (1 * 2) + 1] = vertexId1;
    this.edgesCount += 1;

    // Update our faces
    this.updateFaces();

    // Return our id
    return edgeId;
  },
  updateFaces: function () {
    // Resolve all our smallest faces for each edge
    // DEV: In the 2D space, every face has at least 1 edge that doesn't belong to any other faces
    //   The first exception is a tetrahedron which is in 3D space
    //   We could rant about every face having 3 edges at a minimum but I'm sure there's more nuance to the proof
    //   Back on track: By finding all faces for each edge, we get some duplicates but we also get all faces
    let allSmallestFaces = [];
    for (let i = 0; i < this.edgesCount; i += 1) {
      let smallestFace = this.findSmallestFace(this.edges[(i * 4) + 0], this.edges[(i * 4) + 1],);
      if (smallestFace) {
        allSmallestFaces.push(smallestFace);
      }
    }
    console.log('aaa', allSmallestFaces);
  },
  findSmallestFace: function (vertexId1, vertexId2) {
    // Correction: This is a DFS due to using a stack, instead of a BFS which would be a queue

    // TODO: Clean up code comment
    // Trying to glean a decent strategy from this: https://github.com/furnishup/blueprint3d/blob/cac8b62c1a3839e929334bdc125bf8a74866be9e/src/model/floorplan.ts#L369-L494
    // 1. Find all possible smallest faces - smallest by performing BFS then prioritizing smallest angles
    // 2. Remove duplicate faces with different starting edge (cycles room, hashes into `id1-id2-id3-...`)
    // 3. Remove clockwise faces (since all faces will have both clockwise and counter-clockwise variants)
    // 4. Disco
    // TODO: How do we identify when we subdivide a face so we can persist the fills?
    //   They don't do that in blueprint3d
    //   Something about new face with all edges except new edge being contained by an existing face?
    // TODO: Move to typed data, though this doesn't affect draw performance so questionable
    //   Can also prob rationalize that we don't need typed data since we aren't dealing with 100k data points
    //   These are added by humans instead so at most 100 ._. (lots of clicking)

    // Verbatim rewrite of blueprint3d

    let stack = []; // {vertexId, previousVertexIds: []}
    let next = {
      vertexId: vertexId2,
      previousVertexIds: [vertexId1]
    };
    let visited = {};
    visited[vertexId1] = true;

    while (next) {
      // Start working against our new info, marking our vertex as visited
      let currentVertexId = next.vertexId;
      visited[currentVertexId] = true;

      // If we aren't just starting, and we've completed a cycle, then stop
      if (next.previousVertexIds.length >= 2 && currentVertexId === vertexId1) {
        return next.previousVertexIds;
      }

      // Resolve our adjacent vertex ids
      let adjacentVertexIds = [];
      for (let i = 0; i < this.edgesCount; i += 1) {
        for (let j = 0; j < 2; j += 1) {
          if (currentVertexId === this.edges[(i * 4) + (j * 2) + 0]) {
            adjacentVertexIds.push(this.edges[(i * 4) + (j * 2) + 1]);
          }
        }
      }

      let addToStack = []; // Vertex ids
      for (let i = 0; i < adjacentVertexIds.length; i += 1) {
        let nextVertexId = adjacentVertexIds[i];
        // If we've visited the vertex before and it won't close the cycle, then ignore it
        //   or if we've visited the vertex before but we're on the second vertex
        //   (so it must be the first vertex), then ignore it (closes too early)
        if ((visited[nextVertexId] === true && nextVertexId !== vertexId1) ||
            (visited[nextVertexId] === true && currentVertexId === vertexId2)) {
          continue;
        }

        // Add our unseen adjacent vertex to ones to explore
        addToStack.push(nextVertexId);
      }

      // TODO: Add back sorting as per notes below
      // TODO: Omit sorting for now, heuristically we prob just want shortest cycle as-is -- unsure where angle comes is
      //   Later: It does actually matter... (e.g. concave faces) but not crtical for initial test cases
      //   If we want to leave a note, prob link to the test case
      // if (addToStack.length >= 2) {
      //   let previousVertexId = next.previousVertexIds[next.previousVertexIds.length - 1];
      //   let previousVertexX = that.vertices[(previousVertexId * 2) + 0];
      //   let previousVertexY = that.vertices[(previousVertexId * 2) + 1];
      //   addToStack.sort(function (vertexIdA, vertexIdB) {
      //     let bX = that.vertices[(vertexIdB * 2) + 0];
      //     let bY = that.vertices[(vertexIdB * 2) + 1];
      //     return (this_calculateTheta
      //   });
      // }

      // Push our new stack items onto the stack
      let newPreviousVertexIds = next.previousVertexIds.slice();
      newPreviousVertexIds.push(currentVertexId);
      addToStack.forEach(function (vertexId) {
        stack.push({
          vertexId: vertexId,
          previousVertexIds: newPreviousVertexIds,
        });
      });

      // Move to next item in BFS
      next = stack.pop();
    }
    return null;
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
