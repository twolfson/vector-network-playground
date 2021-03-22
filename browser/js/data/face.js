// Load in our dependencies
const Polygon = require('polygon');

// Define fill style list
// DEV: Prime so we catch multiplier bugs more easily
//   Picked via: https://htmlcolorcodes.com/
const FILL_STYLES = [
  '#ec7063',
  '#9b59b6',
  '#85c1e9',
  '#82e0aa',
  '#f7dc6f',
  '#e67e22',
  '#99a3a4',
];

// Define id tracking singletons
let FACE_ID = 0;

// Define our constructor and overrides
// DEV: Using class extension for `instanceof` checks
class Face extends Polygon {
  constructor(vertices) {
    super(vertices);
    // Provide convenience alias reference
    this.vertices = this.points;
    this.id = FACE_ID++;
    this.fillStyle = FILL_STYLES[this.id % FILL_STYLES.length];
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
