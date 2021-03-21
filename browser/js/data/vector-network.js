// Define our constructor
function VectorNetwork() {
  this.verticesCount = 0;
  this.vertices = new Float32Array(0);
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

  addVertex: function (x, y) {
    // Resize our data to handle the new element
    this.vertices = this.resizeArray(this.vertices, (this.verticesCount + 1) * 2);

    // Update our new location
    let newVertexOffset = this.verticesCount * 2;
    this.vertices[newVertexOffset + 0] = x;
    this.vertices[newVertexOffset + 1] = y;
    this.verticesCount += 1;
  }
};

// Export our constructor
module.exports = VectorNetwork;
