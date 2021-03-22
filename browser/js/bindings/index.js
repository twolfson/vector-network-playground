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
    return function removeListener() {
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
    // Resolve our mouse
    let mouse = this.getMousePosition(evt);

    // If we're close to an existing vertex, then terminate our path
    // TODO: Find vertex + network instead of depending on last network
    let nearbyVertex = this.data.lastVectorNetwork
      ? this.data.lastVectorNetwork.getNearbyVertex(mouse.x, mouse.y, NEARBY_VERTEX_DISTANCE)
      : null;
    if (nearbyVertex !== null) {
      // If this is not the last vertex (so drawing a new edge), then draw our edge
      if (nearbyVertex !== this.data.lastVertex) {
        let vectorNetwork = this.data.lastVectorNetwork;
        vectorNetwork.addEdge(this.data.lastVertex, nearbyVertex);
      }

      // Terminate our path
      this.data.lastVertex = null;
      this.data.lastVectorNetwork = null;

      this._queueRender();
      return;
    }

    // Otherwise, start/continue drawing a path
    let vectorNetwork = this.data.vectorNetworks[0];
    let vertex = vectorNetwork.addVertex(mouse.x, mouse.y);
    if (this.data.lastVertex) {
      vectorNetwork.addEdge(this.data.lastVertex, vertex);
    }

    this.data.lastVertex = vertex;
    this.data.lastVectorNetwork = vectorNetwork;

    this._queueRender();
  },
  handleMousemove: function (evt) {
    let mouse = this.getMousePosition(evt);

    // If we're on an existing path, then snap to any nearby vertices
    // TODO: Find vertex + network instead of depending on last network
    this.data.snappedVertex = null;
    if (this.data.lastVectorNetwork !== null) {
      let nearbyVertex = this.data.lastVectorNetwork.getNearbyVertex(
        mouse.x, mouse.y, NEARBY_VERTEX_DISTANCE);
      if (nearbyVertex !== null) {
        mouse.x = nearbyVertex.x;
        mouse.y = nearbyVertex.y;
        this.data.snappedVertex = nearbyVertex;
      }
    }

    this.data.cursor.x = mouse.x;
    this.data.cursor.y = mouse.y;

    this._queueRender();
  }
};
module.exports = Bindings;
