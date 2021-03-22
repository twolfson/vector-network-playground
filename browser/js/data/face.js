// Load in our dependencies
const Polygon = require('polygon');

// Define id tracking singletons
let FACE_ID = 0;

// Define our constructor and overrides
// DEV: Using class extension for `instanceof` checks
class Face extends Polygon {
  constructor(vertices) {
    super(vertices);
    this.id = FACE_ID++;
  }

  static resetCounter() {
    FACE_ID = 0;
  }

  hash() {
    return this.points.map(function (vertex) {
      return vertex.id;
    }).join('-');
  }

  toString() {
    return `<Face ${this.id}>`;
  }
}
module.exports = Face;
