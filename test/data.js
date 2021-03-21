// Load in our dependencies
const expect = require('chai');
const VectorNetwork = require('../browser/js/data/vector-network');

// Define our tests
describe('A VectorNetwork with an open path', function () {
  // A-B-C
  it('has no faces', function () {
    let network = new VectorNetwork();
    network.startPath();
    network.addVertexToPath(0, 0);
    network.addVertexToPath(10, 0);
    network.addVertexToPath(20, 0);
    network.closePath();

    expect(this.network.verticesCount).to.equal(3);
    expect(this.network.edgesCount).to.equal(2);
    expect(this.network.facesCount).to.equal(0);
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
    network.startPath();
    let firstVertexId = network.path.addVertex(0, 0);
    network.addVertexToPath(10, 0);
    network.addVertexToPath(0, 10);
    network.closePath(firstVertexId);

    expect(this.network.verticesCount).to.equal(3);
    expect(this.network.edgesCount).to.equal(2);
    expect(this.network.facesCount).to.equal(1);
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
    network.startPath();
    network.addVertexToPath(0, 0);
    let secondVertexId = network.addVertexToPath(10, 0);
    network.addVertexToPath(20, 0);
    network.addVertexToPath(10, 10);
    network.closePath(secondVertexId);

    expect(this.network.verticesCount).to.equal(4);
    expect(this.network.edgesCount).to.equal(4);
    expect(this.network.facesCount).to.equal(1);
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

describe.skip('A VectorNetwork adding an edge inside a closed path', function () {
  /*
  A-B      A-B-E
  | |  ->  | |
  D-C      D-C
  */
  it('adds no new faces', function () {

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
