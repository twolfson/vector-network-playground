// Load in our dependencies
const assert = require('assert');
const Edge = require('./edge');
const Face = require('./face');
const Vec2 = require('vec2');
const Vertex = require('./vertex');

const IS_CLOCKWISE = true;
const IS_COUNTERCLOCKWISE = true; // eslint-disable-line

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
  // DEV: blueprint3d uses negative atan2 (vs positive here), so they like counter-clockwise whereas this is clockwise
  let angle = vectorU.angleTo(vectorV);
  if (angle < 0) { angle += Math.PI * 2; }
  return angle;
};
VectorNetwork.prototype = {
  getNearbyVertex: function (x, y, minimumDistance) {
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
    this.updateFaces();

    // Return our edge
    return newEdge;
  },
  updateFaces: function () {
    let that = this;

    // Resolve all our smallest faces for each edge
    // DEV: In the 2D space, every face has at least 1 edge that doesn't belong to any other faces
    //   The first exception is a tetrahedron which is in 3D space
    //   We could rant about every face having 3 edges at a minimum but I'm sure there's more nuance to the proof
    //   Back on track: By finding all faces for each edge, we get some duplicates but we also get all faces
    let allSmallestFaces = [];
    for (let i = 0; i < this.edges.length; i += 1) {
      // DEV: Search in both orientations as we want to find clockwise only faces
      //   but we don't know which way works best for our edge
      //   Counter-clockwise faces will get angles incorrect for comparison so they take longer paths
      let smallestFace;
      smallestFace = this.findSmallestFace(this.edges[i].vertexA, this.edges[i].vertexB);
      if (smallestFace) { allSmallestFaces.push(smallestFace); }
      smallestFace = this.findSmallestFace(this.edges[i].vertexB, this.edges[i].vertexA);
      if (smallestFace) { allSmallestFaces.push(smallestFace); }
    }

    // Remove any counter-clockwise faces
    // DEV: Counter-clockwise faces will get angles incorrect for comparison so they take longer paths
    let orientedFaces = [];
    allSmallestFaces.forEach(function (vertices) {
      let face = new Face(vertices);
      if (face.winding() === IS_CLOCKWISE) {
        orientedFaces.push(face);
      }
    });

    // Deduplicate our faces
    // DEV: We could do this in `O(n)` by doing cycles instead of `nlogn` sorting but meh, faces aren't *that* big
    let deduplicatedFaces = [];
    let seenFaces = {};
    orientedFaces.forEach(function (face) {
      // If our face has been seen before, skip it
      // [2, 0, 1] -> [0, 1, 2] -> 0-1-2
      // DEV: This would lead to mixing of clockwise and counter-clockwise faces so we filter those first
      let faceHash = face.points.map(function (vertex) { return vertex.id; }).sort().join('-');
      if (seenFaces[faceHash] === true) {
        return;
      }
      seenFaces[faceHash] = true;

      // Otherwise, save our deduplicated face
      deduplicatedFaces.push(face);
    });

    // Swap out any already existing faces
    // DEV: Currently broken so omitted for now
    if (false) {
      deduplicatedFaces = deduplicatedFaces.map(function (face) {
        for (let i = 0; i < that.faces.length; i += 1) {
          if (that.faces[i].containsPolygon(face)) {
            return that.faces[i];
          }
        }
        return face;
      });
    }

    // Save our faces
    this.faces = deduplicatedFaces;
  },
  findSmallestFace: function (vertex1, vertex2) {
    // Heavily based on https://github.com/furnishup/blueprint3d/blob/cac8b62c1a3839e929334bdc125bf8a74866be9e/src/model/floorplan.ts#L369-L494
    // Find smallest face by leaning on angles and DFS

    // Define our search starting point
    let stack = []; // Stack of `next` items
    let next = {
      vertex: vertex2,
      previousVertices: [vertex1]
    };
    let visitedVertexIds = {};
    visitedVertexIds[vertex1.id] = true;

    while (next) {
      // Start working against our new info, marking our vertex as visited
      let previousVertex = next.previousVertices[next.previousVertices.length - 1];
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
        // DEV: This is reverse sorted as we push onto stack but pop our last item
        verticesToAddToStack.sort(function (vertexA, vertexB) {
          let angleA = VectorNetwork.getAngle(previousVertex, currentVertex, vertexA);
          let angleB = VectorNetwork.getAngle(previousVertex, currentVertex, vertexB);
          // Use b - a to reverse sort
          return angleB - angleA;
        });
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
