function Bindings({ canvasEl, data }) {
  // Save our parameters
  this.canvasEl = canvasEl;
  this.data = data;

  // Bind our listeners
  this.addEventListeners();

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
  addEventListeners: function () {
    console.log('wat', this.canvasEl.addEventListener('click', this.handleClick));
  },

  handleClick: function (evt) {
    console.log('hi', evt);
  }
}
module.exports = Bindings;
