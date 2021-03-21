// Load in our dependencies
const Polygon = require('polygon');

// Define id tracking singletons
// DEV: Use non-zero starting value so `if` checks are easier
let FACE_ID = 1;

// Define our constructor and overrides
function Face(vertices) {
  let retObj = new Polygon(vertices);
  Object.defineProperties(retObj, Face.prototype);
  retObj.id = FACE_ID++;
  return retObj;
}
Face.prototype = {
  hash: function () {
    return this.points.map(function (vertex) {
      return vertex.id;
    }).join('-');
  },
  toString: function () {
    return `<Face ${this.id}>`;
  }
};
module.exports = Face;
