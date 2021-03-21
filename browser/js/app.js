// Load in our dependencies
const Data = require('./data');
const Scene = require('./scene');
const Bindings = require('./bindings');

// Define our core application
function App(canvasEl) {
  // Define common properties
  this.canvasEl = canvasEl;
  this.context = canvasEl.getContext('2d');
  this.data = new Data();
  this.scene = new Scene({
    context: this.context, data: this.data,
    width: null, height: null,
  });

  // Resolve width/height for scene
  this.handleResize();

  // Set up our UI bindings
  this.bindings = new Bindings({
    canvasEl: this.canvasEl, data: this.data, scene: this.scene,
  });
}
App.prototype = {
  handleResize: function () {
    let width = this.canvasEl.width = window.innerWidth;
    let height = this.canvasEl.height = 600;
    this.scene.setSize(width, height);
  },
};

// Export our constructor
module.exports = App;
