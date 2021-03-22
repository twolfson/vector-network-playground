// Load in our dependencies
const Polygon = require('polygon');

// Define id tracking singletons
// DEV: Use non-zero starting value so `if` checks are easier
let FACE_ID = 1;

// Define our constructor and overrides
class Face extends Polygon {
  constructor(vertices) {
    super(vertices);
    this.id = FACE_ID++;
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
