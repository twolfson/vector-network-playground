// Load in our dependencies
const Vec2 = require('vec2');

// Define id tracking singletons
let VERTEX_ID = 0;

// Define our constructor and overrides
// DEV: Using class extension for `instanceof` checks
class Vertex extends Vec2 {
  constructor(x, y) {
    super(x, y);
    this.id = VERTEX_ID++;
  }

  static resetCounter() {
    VERTEX_ID = 0;
  }

  toString() {
    return `<Vertex ${this.id}>`;
  }
}
module.exports = Vertex;
