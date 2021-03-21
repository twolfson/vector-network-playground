// Load in our dependencies
const Vec2 = require('vec2');

// Define id tracking singletons
// DEV: Use non-zero starting value so `if` checks are easier
let VERTEX_ID = 1;

// Define our constructor and overrides
function Vertex(x, y) {
  let retObj = new Vec2(x, y);
  Object.defineProperties(retObj, Vertex.prototype);
  retObj.id = VERTEX_ID++;
  return retObj;
}
Vertex.prototype = {
  toString: function () {
    return `<Vertex ${this.id}>`;
  }
};

module.exports = Vertex;
