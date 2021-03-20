// DEV: We're starting with a singleton for data, which we can replicate for layers
module.exports = {
  // TODO: Build out resizing by using underlying memory pool
  verticesCount: 0,
  vertices: new Uint8Array(20),

  addVertex: function (x, y) {
    // TODO: Handle resizing of data instead of fixed length
    let newVertexOffset = this.verticesCount * 2;
    this.vertices[newVertexOffset + 0] = x;
    this.vertices[newVertexOffset + 1] = y;
    this.verticesCount += 1;
  }
};
