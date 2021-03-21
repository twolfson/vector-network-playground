// Load in our dependencies
const VectorNetwork = require('./vector-network');

// Provide a container for all our common data
function Data() {
  this.vectorNetworks = [new VectorNetwork()];
}
module.exports = Data;
