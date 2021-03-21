function Bindings({ canvasEl, data }) {
  // Save our parameters
  this.canvasEl = canvasEl;
  this.data = data;

  // Bind our listeners
  this._teardownFns = this.addEventListeners();

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
Bindings.prototype = {
  getMousePosition: function (evt) {
    // https://github.com/twolfson/blueprint3d/blob/twolfson-1.6.0/src/floorplanner/floorplanner.ts#L244-L249
    let canvasOffset = this.getCanvasOffset();
    return {
      x: evt.pageX - canvasOffset.left,
      y: evt.pageY - canvasOffset.top,
    }
  },
  getCanvasOffset: function () {
    // http://youmightnotneedjquery.com/#offset
    let boundingRect = this.canvasEl.getBoundingClientRect();
    return {
      top: boundingRect.top + document.body.scrollTop,
      left: boundingRect.left + document.body.scrollLeft,
    };
   },

  _addEventListener: function (eventType, fn) {
    let boundFn = fn.bind(this);
    this.canvasEl.addEventListener(eventType, boundFn);
    return function removeListener () {
      this.canvasEl.removeEventListener(eventType, boundFn);
    };
  },
  addEventListeners: function () {
    return [
      this._addEventListener('click', this.handleClick),
    ];
  },

  handleClick: function (evt) {
    let mouse = this.getMousePosition(evt);
    let vectorNetwork = this.data.vectorNetworks[0];
    vectorNetwork.addVertex(mouse.x, mouse.y);
  }
}
module.exports = Bindings;
