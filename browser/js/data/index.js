// Load in our dependencies
const VectorNetwork = require('./vector-network');

// Provide a container for all our common data
function Data() {
  this.vectorNetworks = [new VectorNetwork()];

  this.lastVectorNetwork = null;
  this.lastVertex = null;
  this.snappedVertex = null;

  this.cursor = {x: 0, y: 0};
}
module.exports = Data;
