// Define our constructor
function VectorNetwork() {
  this.verticesCount = 0;
  this.vertices = new Float32Array(0);
  this.paths = [];
}
VectorNetwork.prototype = {
  // Based on: https://github.com/stephomi/sculptgl/blob/75bc19bfb666032c9c46010688a802502fc48fd9/src/mesh/dynamic/MeshDynamic.js#L190-L227
  resizeArray: function (original, targetLength) {
    // If our orginal is the same length as the target, then return the original
    if (original.length === targetLength) {
      return original;
    }

    // Otherwise, release subsection of original
    if (original.length > targetLength) {
      // DEV: If we grab *2 of the original and it exceeds the length, then it stops at the length as-is
      //   but we like `Math.min` as extra protection
      return original.subarray(0, Math.min(original.length, targetLength * 2));
    }

    // Otherwise, create new array to use
    // DEV: We allocate 2x size to prevent resizing too often
    //   However, as a result we must use `verticesCount` instead of the array length always
    let tmp = new original.constructor(targetLength * 2);
    tmp.set(original);
    return tmp;
  },

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

  addVertex: function (x, y) {
    // Resize our data to handle the new element
    let vertexId = this.verticesCount;
    this.vertices = this.resizeArray(this.vertices, (this.verticesCount + 1) * 2);

    // Update our new location
    this.vertices[vertexId*2 + 0] = x;
    this.vertices[vertexId*2 + 1] = y;
    this.verticesCount += 1;

    // Return our id
    return vertexId;
  },
};

// Export our constructor
module.exports = VectorNetwork;
