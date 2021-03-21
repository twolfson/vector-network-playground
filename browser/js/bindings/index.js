function Bindings({ canvasEl, data }) {
  // Save our parameters
  this.canvasEl = canvasEl;
  this.data = data;

  // Bind our listeners
  this._teardownFns = this.addEventListeners();
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
      this._addEventListener('mousemove', this.handleMousemove),
    ];
  },

  handleClick: function (evt) {
    let mouse = this.getMousePosition(evt);
    let vectorNetwork = this.data.vectorNetworks[0];
    vectorNetwork.addVertex(mouse.x, mouse.y);
  },
  handleMousemove: function (evt) {
    // TODO: Handle mouse snapping
    let mouse = this.getMousePosition(evt);
    this.data.cursor.x = mouse.x;
    this.data.cursor.y = mouse.y;
  }
}
module.exports = Bindings;
