// Define our constructor
function VectorNetwork() {
  // TODO: Build out resizing by using underlying memory pool
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

    // Otherwise, remove subsection of original
    // DEV: Bug in SculptGL is resizing to length * 2 without guarantee in conditional so memory leak
    if (original.length > targetLength) {
      return original.subarray(0, targetLength);
    }

    // Otherwise, create new array to use
    // TODO: Better understand why they were using *2 here, guessing for memory expansion
    //   but we need to see how they use subarray to prevent grabbing too much
    let tmp = new original.constructor(targetLength);
    tmp.set(original);
    return tmp;
  },

  addVertex: function (x, y) {
    this.vertices = this.resizeArray(this.vertices, (this.verticesCount + 1) * 2);

    // TODO: Handle resizing of data instead of fixed length
    let newVertexOffset = this.verticesCount * 2;
    this.vertices[newVertexOffset + 0] = x;
    this.vertices[newVertexOffset + 1] = y;
    this.verticesCount += 1;
  }
};

// Export our constructor
module.exports = VectorNetwork;
