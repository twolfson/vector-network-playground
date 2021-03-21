// Load in our dependencies
const assert = require('assert');
const Edge = require('./edge');
const Polygon = require('polygon');
const utils = require('./utils');
const Vec2 = require('vec2');

// Define our constructor
function VectorNetwork() {
  this.vertices = [];
  this.edges = [];
  this.faces = [];
}
VectorNetwork.prototype = {
  getNearbyVertexId: function (x, y, minimumDistance) {
    // Define our default variables
    let closestVertex = null;
    let closestVertexDistance = Infinity;

    // Find the closest vertex
    let point = new Vec2(x, y);
    for (let i = 0; i < this.vertices.length; i += 1) {
      let distance = this.vertices[i].distance(point);
      if (distance <= minimumDistance && distance < closestVertexDistance) {
        closestVertexDistance = distance;
        closestVertex = this.vertices[i];
      }
    }

    // Return our closest vertex
    return closestVertex;
  },

  addVertex: function (x, y) {
    let point = new Vec2(x, y);
    this.vertices.push(point);
    return point;
  },
  addEdge: function (vertex1, vertex2) {
    // If the edge already exists, return it
    assert.notEqual(vertex1, vertex2, 'Vertices are the same');
    let newEdge = new Edge(vertex1, vertex2);
    for (let i = 0; i < this.edges.length; i += 1) {
      if (newEdge.matches(this.edges[i])) {
        return this.edges[i];
      }
    }

    // Save our new edge
    this.edges.push(newEdge);

    // TODO: Update our faces
    // this.updateFaces();

    // Return our id
    return newEdge;
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

    // Deduplicate our faces
    // DEV: We could do this in `O(n)` by doing cycles instead of `nlogn` sorting but meh, faces aren't *that* big
    let deduplicatedFaces = [];
    let seenFaces = {};
    allSmallestFaces.forEach(function (face) {
      // If our face has been seen before, skip it
      // [2, 0, 1] -> [0, 1, 2] -> 0-1-2
      // DEV: Another downside of this is we combine clockwise and counter-clockwise faces
      //   so instead of filtering out clockwise, we need to reverse them
      let faceHash = face.slice().sort().join('-');
      if (seenFaces[faceHash] === true) {
        return;
      }
      seenFaces[faceHash] = true;

      // Otherwise, save our deduplicated face
      deduplicatedFaces.push(face);
    });

    // TODO: Add cycle reversing for clockwise faces
    let normalizedFaces = deduplicatedFaces;

    // TODO: Detect added/dropped faces
    console.log('aaa', normalizedFaces);
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
};

// Export our constructor
module.exports = VectorNetwork;
