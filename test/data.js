// Load in our dependencies
const expect = require('chai').expect;
const VectorNetwork = require('../browser/js/data/vector-network');

// Define our tests
describe('A VectorNetwork with an open path', function () {
  // A-B-C
  it('has no faces', function () {
    let network = new VectorNetwork();
    let vertices = [
      network.addVertex(0,  0),
      network.addVertex(10, 0),
      network.addVertex(20, 0),
    ];
    network.addEdge(vertices[0], vertices[1]);
    network.addEdge(vertices[1], vertices[2]);

    expect(network.vertices.length).to.equal(3);
    expect(network.edges.length).to.equal(2);
    expect(network.faces.length).to.equal(0);
  });
});

describe('A VectorNetwork with a closed path', function () {
  /*
  A-B
  |/
  C
  */
  it('has 1 face', function () {
    let network = new VectorNetwork();
    let vertices = [
      network.addVertex(0,   0),
      network.addVertex(10,  0),
      network.addVertex(0,  10),
    ];
    network.addEdge(vertices[0], vertices[1]);
    network.addEdge(vertices[1], vertices[2]);
    network.addEdge(vertices[2], vertices[0]);

    expect(network.vertices.length).to.equal(3);
    expect(network.edges.length).to.equal(3);
    expect(network.faces.length).to.equal(1);
  });
});

describe('A VectorNetwork with a closed path and excess', function () {
  /*
  A-B-C
    |/
    D
  */
  it('has 1 face', function () {
    let network = new VectorNetwork();
    let vertices = [
      network.addVertex(0,   0),
      network.addVertex(10,  0),
      network.addVertex(20,  0),
      network.addVertex(10, 10),
    ];
    network.addEdge(vertices[0], vertices[1]);
    network.addEdge(vertices[1], vertices[2]);
    network.addEdge(vertices[2], vertices[3]);
    network.addEdge(vertices[3], vertices[1]);

    expect(network.vertices.length).to.equal(4);
    expect(network.edges.length).to.equal(4);
    expect(network.faces.length).to.equal(1);
  });
});

describe('A VectorNetwork adding an existing edge', function () {
  // A-B + B-A
  it('does nothing', function () {
    let network = new VectorNetwork();
    let vertices = [
      network.addVertex(0,   0),
      network.addVertex(10,  0),
    ];
    network.addEdge(vertices[0], vertices[1]);
    network.addEdge(vertices[1], vertices[0]);

    expect(network.vertices.length).to.equal(2);
    expect(network.edges.length).to.equal(1);
    expect(network.faces.length).to.equal(0);
  });
});

describe('A VectorNetwork adding a new and unrelated face', function () {
  /*
    D        D
     \      / \
  A---B    A---B
   \ /  ->  \ /
    C        C
  */
  it('adds the face successfully', function () {
    let network = new VectorNetwork();
    let vertices = [
      network.addVertex(0,   0),
      network.addVertex(10,  0),
      network.addVertex(5, -10),
      network.addVertex(5,  10),
    ];
    // Lower triangle
    network.addEdge(vertices[0], vertices[1]);
    network.addEdge(vertices[1], vertices[2]);
    network.addEdge(vertices[2], vertices[3]);

    // Upper triangle
    network.addEdge(vertices[1], vertices[3]);
    network.addEdge(vertices[3], vertices[0]);

    expect(network.vertices.length).to.equal(4);
    expect(network.edges.length).to.equal(5);
    expect(network.faces.length).to.equal(2);
    console.log(network.faces[0].hash());
  });
});

describe.skip('A VectorNetwork adding an edge inside a closed path', function () {
  /*
  A-B      A-B
  | |  ->  |\|
  D-C      D-C
  */
  it('adds another face', function () {

  });
});

describe.skip('A VectorNetwork adding an edge outside a closed path', function () {
  /*
  A-B      A-B-E
  | |  ->  | |
  D-C      D-C
  */
  it('adds no new faces', function () {

  });
});

describe.skip('A VectorNetwork with a concave face', function () {
  /*
  A---B  ->  A---B
  |   |  ->  |\  |
  |   |  ->  | E |
  |   |  ->  |/  |
  D---C  ->  D---C
  */
  it('finds the 2 smallest faces successfully', function () {
    // DEV: This should have shuffled order
  });
});

describe.skip('A VectorNetwork splitting an edge inside a closed path', function () {
  /*
  A---B      A---B
  |   |  ->  |   |
  D---C      D-E-C
  */
  it('adds no new faces', function () {

  });
});

describe.skip('A VectorNetwork adding an edge with overlapping paths', function () {
  // DEV: We must have C be connected to A initially, otherwise they aren't part of the same network technically
  /*
  A---C      A---C
   \          \ /
    \    ->    E
     \        / \
      B      D   B
  */
  it('splits the edge', function () {

  });
});

// TODO: Prob have some gnarly edge cases with "closed path and excess" case
describe.skip('A VectorNetwork adding an edge with overlapping paths', function () {
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
