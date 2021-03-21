// Load in our dependencies
const expect = require('chai').expect;
const VectorNetwork = require('../browser/js/data/vector-network');

// Define our tests
describe('A VectorNetwork with an open path', function () {
  // A-B-C
  it('has no faces', function () {
    let network = new VectorNetwork();
    let vertexIds = [
      network.addVertex(0,  0),
      network.addVertex(10, 0),
      network.addVertex(20, 0),
    ];
    network.addEdge(vertexIds[0], vertexIds[1]);
    network.addEdge(vertexIds[1], vertexIds[2]);

    expect(network.verticesCount).to.equal(3);
    expect(network.edgesCount).to.equal(2);
    expect(network.facesCount).to.equal(0);
  });
});

describe.only('A VectorNetwork with a closed path', function () {
  /*
  A-B
  |/
  C
  */
  it('has 1 face', function () {
    let network = new VectorNetwork();
    let vertexIds = [
      network.addVertex(0,   0),
      network.addVertex(10,  0),
      network.addVertex(0,  10),
    ];
    network.addEdge(vertexIds[0], vertexIds[1]);
    network.addEdge(vertexIds[1], vertexIds[2]);
    network.addEdge(vertexIds[2], vertexIds[0]);

    // console.log('Smallest face:', network.findSmallestFace(vertexIds[0], vertexIds[1]));

    expect(network.verticesCount).to.equal(3);
    expect(network.edgesCount).to.equal(3);
    expect(network.facesCount).to.equal(1);
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
    let vertexIds = [
      network.addVertex(0,   0),
      network.addVertex(10,  0),
      network.addVertex(20,  0),
      network.addVertex(10, 10),
    ];
    network.addEdge(vertexIds[0], vertexIds[1]);
    network.addEdge(vertexIds[1], vertexIds[2]);
    network.addEdge(vertexIds[2], vertexIds[3]);
    network.addEdge(vertexIds[3], vertexIds[1]);

    expect(network.verticesCount).to.equal(4);
    expect(network.edgesCount).to.equal(4);
    // expect(network.facesCount).to.equal(1);
  });
});

describe.skip('A VectorNetwork adding an existing edge', function () {
  // A-B
  it('does nothing', function () {
    let network = new VectorNetwork();
    let vertexIds = [
      network.addVertex(0,   0),
      network.addVertex(10,  0),
    ];
    network.addEdge(vertexIds[0], vertexIds[1]);
    network.addEdge(vertexIds[1], vertexIds[0]);

    expect(network.verticesCount).to.equal(1);
    expect(network.edgesCount).to.equal(1);
    // expect(network.facesCount).to.equal(0);
  });
});

describe.skip('A VectorNetwork adding a new and unrelated face', function () {
  /*
    D        D
     \      / \
  A---B    A---B
   \ /  ->  \ /
    C        C
  */
  it('adds the face successfully', function () {

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
