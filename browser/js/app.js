// Define our core application
function App(canvasEl) {
  // Define common properties
  this.canvasEl = canvasEl;
  this.context = canvasEl.getContext('2d');
  this.width = null;
  this.height = null;

  // Resolve our width/height
  this.handleResize();

  // Start our render loop
  this.queueRender();
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
    this.context.clearRect(0, 0, this.width, this.height);
    this.context.fillRect(0, 0, 100, 100);
  }
}

// Export our constructor
module.exports = App;
