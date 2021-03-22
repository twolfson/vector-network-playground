// Load in our dependencies
const Vec2 = require('vec2');

// Define id tracking singletons
// DEV: Use non-zero starting value so `if` checks are easier
let VERTEX_ID = 1;

// Define our constructor and overrides
class Vertex extends Vec2 {
  constructor(x, y) {
    super(x, y);
    this.id = VERTEX_ID++;
  }

  toString() {
    return `<Vertex ${this.id}>`;
  }
}
module.exports = Vertex;
