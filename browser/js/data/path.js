// Load in our dependencies
const utils = require('./utils');

// Define our constructor
function Path() {
  this.vertexIdCount = 0;
  this.vertexIds = new Uint8Array(0);
}
Path.prototype = {
  pushVertexId: function (id) {
    this.vertexIds = utils.resizeArray(this.vertexIds, (this.vertexIdCount + 1) * 1);
    this.vertexIds[this.vertexIdCount] = id;
    this.vertexIdCount += 1;
  },
};

// Export our constructor
module.exports = Path;
