// Define our constructor
function VectorNetwork() {
  // TODO: Build out resizing by using underlying memory pool
  this.verticesCount = 0;
  this.vertices = new Uint32Array(20);
}
VectorNetwork.prototype = {
  addVertex: function (x, y) {
    // TODO: Handle resizing of data instead of fixed length
    let newVertexOffset = this.verticesCount * 2;
    this.vertices[newVertexOffset + 0] = x;
    this.vertices[newVertexOffset + 1] = y;
    this.verticesCount += 1;
  }
};

// Export our constructor
module.exports = VectorNetwork;
