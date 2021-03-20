// Load in our dependencies
const assert = require('assert');
const App = require('./app');

// Define our main page load hook
function main() {
  // Resolve our container and intialize our application
  let canvasEl = document.getElementById('canvas');
  assert(canvasEl, 'Unable to find #canvas element');
  new App(canvasEl);
}
main();
