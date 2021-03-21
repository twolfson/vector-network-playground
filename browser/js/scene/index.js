const VERTEX_SIZE = 10;
const CURSOR_DOT_SIZE = 5;

function Scene({ context, data, width, height }) {
  // Define our common properties
  this.context = context;
  this.data = data;
  this.width = width;
  this.height = height;

  // Start our render loop
  this.queueRender();
}
Scene.prototype ={
  setSize: function (width, height) {
    this.width = width;
    this.height = height;
  },

  queueRender: function () {
    let that = this;
    requestAnimationFrame(function () {
      that.render();
    })
  },
  render: function () {
    // Clear our initial scene
    let that = this;
    let data = this.data;
    this.context.clearRect(0, 0, this.width, this.height);

    // Draw our vector networks
    // TODO: Adjust drawings to center on each item we're drawing
    data.vectorNetworks.forEach(function (vectorNetwork) {
      let vertices = vectorNetwork.vertices;
      for (let i = 0; i < vectorNetwork.verticesCount; i += 1) {
        that.context.fillStyle = '#000000';
        that.context.fillRect(
          vertices[i*2 + 0] - VERTEX_SIZE/2,
          vertices[i*2 + 1] - VERTEX_SIZE/2,
          VERTEX_SIZE, VERTEX_SIZE);
      }
    });

    // If we have a last vertex, draw an edge from it
    if (data.lastVertexId !== null) {
      let lastVertexX = data.lastVectorNetwork.vertices[data.lastVertexId * 2 + 0];
      let lastVertexY = data.lastVectorNetwork.vertices[data.lastVertexId * 2 + 1];

      that.context.beginPath();
      that.context.moveTo(lastVertexX, lastVertexY);
      this.context.lineTo(data.cursor.x, data.cursor.y);
      that.context.strokeStyle = '#000000';
      this.context.stroke();
    }

    // Draw our cursor on top of everything
    that.context.fillStyle = '#000000';
    this.context.fillRect(
      data.cursor.x - CURSOR_DOT_SIZE/2,
      data.cursor.y - CURSOR_DOT_SIZE/2,
      CURSOR_DOT_SIZE, CURSOR_DOT_SIZE);
  },
};
module.exports = Scene;
