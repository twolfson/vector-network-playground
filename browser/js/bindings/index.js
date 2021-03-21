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
    };
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
    // TODO: Find vertex + network instead of depending on last network
    if (this.data.lastVectorNetwork !== null) {
      let nearbyVertexId = this.data.lastVectorNetwork.getNearbyVertexId(
        mouse.x, mouse.y, NEARBY_VERTEX_DISTANCE);
      if (nearbyVertexId !== null) {
        this.data.lastPathId = null;
        this.data.lastVertexId = null;
        this.data.lastVectorNetwork = null;

        this._queueRender();
        return;
      }
    }

    // Otherwise, start one/continue to add to it
    let vectorNetwork = this.data.vectorNetworks[0];
    let pathId = this.data.lastPathId !== null ? this.data.lastPathId : vectorNetwork.addPath();
    let vertexId = vectorNetwork.pushVertexToPath(pathId, mouse.x, mouse.y);

    this.data.lastPathId = pathId;
    this.data.lastVertexId = vertexId;
    this.data.lastVectorNetwork = vectorNetwork;

    this._queueRender();
  },
  handleMousemove: function (evt) {
    let mouse = this.getMousePosition(evt);

    // If we're on an existing path, then snap to any nearby vertices
    // TODO: Find vertex + network instead of depending on last network
    this.data.snappedVertexId = null;
    if (this.data.lastVectorNetwork !== null) {
      let nearbyVertexId = this.data.lastVectorNetwork.getNearbyVertexId(
        mouse.x, mouse.y, NEARBY_VERTEX_DISTANCE);
      if (nearbyVertexId !== null) {
        mouse.x = this.data.lastVectorNetwork.vertices[nearbyVertexId*2 + 0];
        mouse.y = this.data.lastVectorNetwork.vertices[nearbyVertexId*2 + 1];
        this.data.snappedVertexId = nearbyVertexId;
      }
    }

    this.data.cursor.x = mouse.x;
    this.data.cursor.y = mouse.y;

    this._queueRender();
  }
}
module.exports = Bindings;
