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
      that.queueRender();
    })
  },
  render: function () {
    // Clear our initial scene
    let that = this;
    let data = this.data;
    this.context.clearRect(0, 0, this.width, this.height);

    // Draw our vector networks
    data.vectorNetworks.forEach(function (vectorNetwork) {
      let vertices = vectorNetwork.vertices;
      for (let i = 0; i < vectorNetwork.verticesCount; i += 1) {
        that.context.fillRect(vertices[i*2 + 0], vertices[i*2 + 1], 10, 10);
      }
    });

    // Draw our cursor on top of everything
    this.context.fillRect(data.cursor.x, data.cursor.y, 5, 5);
  },
};
module.exports = Scene;
