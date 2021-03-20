// Define our core application
function App(canvasEl) {
  this.canvasEl = canvasEl;
  this.context = canvasEl.getContext('2d');
  this.queueRender();
}
App.prototype = {
  queueRender: function () {
    let that = this;
    requestAnimationFrame(function () {
      that.render();
      that.queueRender();
    })
  },
  render: function () {
    this.context.clearRect(0, 0, 100, 100);
    this.context.fillRect(0, 0, 100, 100);
  }
}

// Export our constructor
module.exports = App;
