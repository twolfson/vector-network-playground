// Load in our dependencies
const assert = require('assert');
const Edge = require('./edge');
const Face = require('./face');
const Vec2 = require('vec2');
const Vertex = require('./vertex');

// Define our constructor
function VectorNetwork() {
  this.vertices = [];
  this.edges = [];
  this.faces = [];
}
VectorNetwork.resetCounter = function () {
  Edge.resetCounter();
  Face.resetCounter();
  Vertex.resetCounter();
};
VectorNetwork.getAngle = function (vertexA, vertexB, vertexC) {
  /*
  Visual goal: B is center-point and we want to calculate angle between A and C
  vertexA
  ^        \
  |--ANGLE  \ hypotenuse/tangent for angle
  |    |     \
  vertexB----> vertexC
  */

  // To convert vertices to vectors, use the following:
  // vertexA = vectorA from origin
  // 0,0 ------> vertexA
  //       ^ vectorA

  // 0,0 ----------------> vertexA
  // 0,0 -> vertexB

  //          vertexB ---> vertexA =
  // 0,0 ----------------> vertexA
  // vertexB <- 0,0 (backwards because minus)

  // Load our temporary variables
  let vectorU = VectorNetwork._tmpAngleVectorU = VectorNetwork._tmpAngleVectorU || new Vec2();
  let vectorV = VectorNetwork._tmpAngleVectorV = VectorNetwork._tmpAngleVectorV || new Vec2();

  // Perform our calculation
  vectorU.set(vertexA, false /* notify */); vectorU.subtract(vertexB, false /* returnNew */);
  vectorV.set(vertexC, false /* notify */); vectorU.subtract(vertexB, false /* returnNew */);
  let angle = vectorU.angleTo(vectorV);
  if (angle < 0) { angle += Math.PI * 2; }
  return angle;
};
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
    let vertex = new Vertex(x, y);
    this.vertices.push(vertex);
    return vertex;
  },
  addEdge: function (vertex1, vertex2) {
    // If the edge already exists, return it
    assert.notEqual(vertex1, vertex2, 'Vertices are the same');
    for (let i = 0; i < this.edges.length; i += 1) {
      if (this.edges[i].matches(vertex1, vertex2)) {
        return this.edges[i];
      }
    }

    // Save our new edge
    let newEdge = new Edge(vertex1, vertex2);
    this.edges.push(newEdge);

    // Update our faces
    // TODO: Re-enable updateFaces
    this.updateFaces();

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
    for (let i = 0; i < this.edges.length; i += 1) {
      let smallestFace = this.findSmallestFace(this.edges[i].vertexA, this.edges[i].vertexB);
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
      //   so instead of filtering out clockwise, we need to reverse them later on
      let faceHash = face.slice().map(function (vertex) { return vertex.id; }).sort().join('-');
      if (seenFaces[faceHash] === true) {
        return;
      }
      seenFaces[faceHash] = true;

      // Otherwise, save our deduplicated face
      deduplicatedFaces.push(face);
    });

    //  Add cycle reversing for clockwise faces
    let normalizedFaces = deduplicatedFaces.map(function (vertices) {
      let face = new Face(vertices);
      return face.rewind(false); // false means make all faces counter-clockwise
    });

    // TODO: Detect added/dropped faces

    // Save our faces
    this.faces = normalizedFaces;
  },
  findSmallestFace: function (vertex1, vertex2) {
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

    // Heavily based on https://github.com/furnishup/blueprint3d/blob/cac8b62c1a3839e929334bdc125bf8a74866be9e/src/model/floorplan.ts#L369-L494
    let stack = []; // Stack of `next` items
    let next = {
      vertex: vertex2,
      previousVertices: [vertex1]
    };
    let visitedVertexIds = {};
    visitedVertexIds[vertex1.id] = true;

    while (next) {
      // Start working against our new info, marking our vertex as visited
      let currentVertex = next.vertex;
      visitedVertexIds[currentVertex.id] = true;

      // If we aren't just starting, and we've completed a cycle, then stop
      if (next.previousVertices.length >= 2 && currentVertex === vertex1) {
        return next.previousVertices;
      }

      // Resolve our adjacent vertex ids
      let adjacentVertices = [];
      for (let i = 0; i < this.edges.length; i += 1) {
        if (this.edges[i].contains(currentVertex)) {
          adjacentVertices.push(this.edges[i].other(currentVertex));
        }
      }

      let verticesToAddToStack = [];
      for (let i = 0; i < adjacentVertices.length; i += 1) {
        let adjacentVertex = adjacentVertices[i];
        // If we've visited the vertex before and it won't close the cycle, then ignore it
        //   or if we've visited the vertex before but we're on the second vertex
        //   (so it must be the first vertex), then ignore it (closes too early)
        if ((visitedVertexIds[adjacentVertex.id] === true && adjacentVertex !== vertex1) ||
            (visitedVertexIds[adjacentVertex.id] === true && currentVertex === vertex2)) {
          continue;
        }

        // Add our unseen adjacent vertex to ones to explore
        verticesToAddToStack.push(adjacentVertex);
      }

      // Sort by smallest angle (e.g. concave face inside a square should be matched first)
      if (verticesToAddToStack.length >= 2) {
        let previousVertex = next.previousVertices[next.previousVertices.length - 1];
        verticesToAddToStack.sort(function (vertexA, vertexB) {
          let angleA = VectorNetwork.getAngle(previousVertex, currentVertex, vertexA);
          let angleB = VectorNetwork.getAngle(previousVertex, currentVertex, vertexB);
          return angleA - angleB;
        });
        console.log('aaa', verticesToAddToStack);
      }

      // Push our new stack items onto the stack
      let newPreviousVertices = next.previousVertices.slice();
      newPreviousVertices.push(currentVertex);
      verticesToAddToStack.forEach(function (vertex) {
        stack.push({
          vertex: vertex,
          previousVertices: newPreviousVertices,
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
