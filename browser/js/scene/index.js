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
Scene.prototype = {
  setSize: function (width, height) {
    this.width = width;
    this.height = height;
  },

  queueRender: function () {
    let that = this;
    requestAnimationFrame(function () {
      that.render();
    });
  },
  render: function () {
    // Clear our initial scene
    let that = this;
    let data = this.data;
    this.context.clearRect(0, 0, this.width, this.height);

    // Draw our vector networks
    data.vectorNetworks.forEach(function (vectorNetwork) {
      // Draw our faces first
      let faces = vectorNetwork.faces;
      let edges = vectorNetwork.edges;
      let vertices = vectorNetwork.vertices;
      faces.forEach(function (face) {
        that.context.beginPath();
        that.context.moveTo(face.vertices[0].x, face.vertices[0].y);
        for (let i = 1; i < face.vertices.length; i += 1) {
          that.context.lineTo(face.vertices[i].x, face.vertices[i].y);
        }
        that.context.fillStyle = face.fillStyle;
        that.context.fill();
      });

      // Then draw our edges over our faces
      edges.forEach(function (edge) {
        that.context.beginPath();
        that.context.moveTo(edge.vertexA.x, edge.vertexA.y);
        that.context.lineTo(edge.vertexB.x, edge.vertexB.y);
        that.context.strokeStyle = '#000000';
        that.context.stroke();
      });

      // Then draw our vertices over our edges
      vertices.forEach(function (vertex) {
        that.context.fillStyle = vertex === data.snappedVertex ? '#FF00FF' : '#000000';
        that.context.fillRect(
          vertex.x - (VERTEX_SIZE / 2),
          vertex.y - (VERTEX_SIZE / 2),
          VERTEX_SIZE, VERTEX_SIZE);
      });
    });

    // If we have a last vertex, draw an edge from it
    if (data.lastVertex !== null) {
      that.context.beginPath();
      that.context.moveTo(data.lastVertex.x, data.lastVertex.y);
      this.context.lineTo(data.cursor.x, data.cursor.y);
      that.context.strokeStyle = '#000000';
      this.context.stroke();
    }

    // Draw our cursor on top of everything
    if (data.snappedVertex === null) {
      that.context.fillStyle = '#000000';
      this.context.fillRect(
        data.cursor.x - (CURSOR_DOT_SIZE / 2),
        data.cursor.y - (CURSOR_DOT_SIZE / 2),
        CURSOR_DOT_SIZE, CURSOR_DOT_SIZE);
    }
  },
};
module.exports = Scene;
