// Load in our dependencies
const VectorNetwork = require('./data/vector-network');
const Scene = require('./scene');

// Define our core application
function App(canvasEl) {
  // Define common properties
  this.canvasEl = canvasEl;
  this.context = canvasEl.getContext('2d');
  this.data = {vectorNetworks: [new VectorNetwork()]};
  this.scene = new Scene({
    context: this.context, data: this.data,
    width: null, height: null
  });

  // Resolve width/height for scene
  this.handleResize();

  // TODO: Remove dev vertices
  let vectorNetwork = this.data.vectorNetworks[0];
  setTimeout(() => vectorNetwork.addVertex(0, 20), 1e3);
  setTimeout(() => vectorNetwork.addVertex(40, 20), 3e3);
  setTimeout(() => vectorNetwork.addVertex(80, 20), 5e3);
  setTimeout(() => vectorNetwork.addVertex(120, 20), 7e3);
  setTimeout(() => vectorNetwork.addVertex(160, 20), 9e3);
  setTimeout(() => vectorNetwork.addVertex(200, 20), 11e3);
  setTimeout(() => vectorNetwork.addVertex(240, 20), 13e3);
  setTimeout(() => vectorNetwork.addVertex(280, 20), 15e3);
}
App.prototype = {
  handleResize: function () {
    let width = this.canvasEl.width = window.innerWidth;
    let height = this.canvasEl.height = 600;
    this.scene.setSize(width, height);
  },
}

// Export our constructor
module.exports = App;
