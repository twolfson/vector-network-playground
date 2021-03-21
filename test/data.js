// Load in our dependencies
const VectorNetwork = require('../browser/js/data/vector-network');

// Define our tests
describe('A VectorNetwork with an open path', function () {
  // A-B-C
  it('has no faces', function () {

  });
});

describe('A VectorNetwork with a closed path', function () {
  /*
  A-B
  |/
  C
  */
  it('has 1 face', function () {

  });
});

describe('A VectorNetwork adding an edge inside a closed path', function () {
  /*
  A-B      A-B
  | |  ->  |\|
  D-C      D-C
  */
  it('adds another face', function () {

  });
});

describe('A VectorNetwork adding an edge inside a closed path', function () {
  /*
  A-B      A-B-E
  | |  ->  | |
  D-C      D-C
  */
  it('adds no new faces', function () {

  });
});

describe('A VectorNetwork splitting an edge inside a closed path', function () {
  /*
  A---B      A---B
  |   |  ->  |   |
  D---C      D-E-C
  */
  it('adds no new faces', function () {

  });
});

describe('A VectorNetwork adding an edge with overlapping paths', function () {
  /*
  A---B      A---B
  |\  |      |\ /|
  | \ |  ->  | E |
  |  \|      |/ \|
  D---C      D---C
  */
  it('splits the edge', function () {

  });
});
