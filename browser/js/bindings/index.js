const NEARBY_VERTEX_DISTANCE = 10;

function Bindings({ canvasEl, data, scene }) {
  // Save our parameters
  this.canvasEl = canvasEl;
  this.data = data;
  this.scene = scene;

  // Bind our listeners
  this._teardownFns = this.addEventListeners();
}
Bindings.prototype = {
  _queueRender: function () {
    this.scene.queueRender();
  },

  getMousePosition: function (evt) {
    // https://github.com/twolfson/blueprint3d/blob/twolfson-1.6.0/src/floorplanner/floorplanner.ts#L244-L249
    let canvasOffset = this.getCanvasOffset();
    return {
      x: evt.pageX - canvasOffset.left - window.scrollX,
      y: evt.pageY - canvasOffset.top - window.scrollY,
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
    // TODO: Handle loop closing
    // Resolve our mouse
    let mouse = this.getMousePosition(evt);

    // If we're close to an existing vertex, then close our path
    if (false) {
      // TODO: Write out conditional
      this.data.lastVertexId = null;
      this.data.lastVectorNetwork = null;
    // Otherwise, start one/continue to add to it
    } else {
      let vectorNetwork = this.data.vectorNetworks[0];
      let vertexId = vectorNetwork.addVertex(mouse.x, mouse.y);

      this.data.lastVertexId = vertexId;
      this.data.lastVectorNetwork = vectorNetwork;
    }

    this._queueRender();
  },
  handleMousemove: function (evt) {
    // TODO: Handle mouse snapping to vertex
    // If we're on an existing path, then find any nearby vertices
    let mouse = this.getMousePosition(evt);
    if (this.data.lastVectorNetwork !== null) {
      console.log(this.data.lastVectorNetwork.getNearbyVertex(mouse.x, mouse.y, NEARBY_VERTEX_DISTANCE));
    }

    this.data.cursor.x = mouse.x;
    this.data.cursor.y = mouse.y;

    this._queueRender();
  }
}
module.exports = Bindings;
