// Load in our dependencies
const VectorNetwork = require('./data/vector-network');

// Define our core application
function App(canvasEl) {
  // Define common properties
  this.canvasEl = canvasEl;
  this.context = canvasEl.getContext('2d');
  this.vectorNetworks = [new VectorNetwork()];
  this.width = null;
  this.height = null;

  // Resolve our width/height
  this.handleResize();

  // Start our render loop
  this.queueRender();

  // TODO: Remove dev vertices
  setTimeout(() => this.vectorNetworks[0].addVertex(20, 20), 1e3);
  setTimeout(() => this.vectorNetworks[0].addVertex(40, 20), 3e3);
  setTimeout(() => this.vectorNetworks[0].addVertex(80, 20), 5e3);
  setTimeout(() => this.vectorNetworks[0].addVertex(120, 20), 7e3);
  setTimeout(() => this.vectorNetworks[0].addVertex(160, 20), 9e3);
  setTimeout(() => this.vectorNetworks[0].addVertex(200, 20), 11e3);
  setTimeout(() => this.vectorNetworks[0].addVertex(240, 20), 13e3);
  setTimeout(() => this.vectorNetworks[0].addVertex(280, 20), 15e3);
}
App.prototype = {
  handleResize: function () {
    let boundingRect = this.canvasEl.getBoundingClientRect();
    this.width = boundingRect.width;
    this.height = boundingRect.height;
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
    this.vectorNetworks.forEach(function (vectorNetwork) {
      let vertices = vectorNetwork.vertices;
      for (let i = 0; i < vertices.length; i += 2) {
        that.context.fillRect(vertices[i + 0], vertices[i + 1], 10, 10);
      }
    });
  }
}

// Export our constructor
module.exports = App;
