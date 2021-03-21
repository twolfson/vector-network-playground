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
    let that = this;
    this.context.clearRect(0, 0, this.width, this.height);
    this.data.vectorNetworks.forEach(function (vectorNetwork) {
      let vertices = vectorNetwork.vertices;
      for (let i = 0; i < vectorNetwork.verticesCount; i += 1) {
        that.context.fillRect(vertices[i*2 + 0], vertices[i*2 + 1], 10, 10);
      }
    });
  },
};
module.exports = Scene;
