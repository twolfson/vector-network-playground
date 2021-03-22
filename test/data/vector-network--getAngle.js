// Load in our dependencies
const expect = require('chai').expect;
const VectorNetwork = require('../../browser/js/data/vector-network');
const Vertex = require('../../browser/js/data/vertex');

// DEV: A->B must stay fixed on the x-axis for all these tests to be sane
describe.only('VectorNetwork#getAngle', function () {
  it('resolves 90 degree angles', function () {
    /*
    C
    |
    B-A
    */
    let angle = VectorNetwork.getAngle(
      new Vertex(10, 0),
      new Vertex(0, 0),
      new Vertex(0, 10),
    );
    expect(angle).to.equal(Math.PI / 2);
  });

  it('resolves 180 degree angles', function () {
    /*
    C-B-A
    */
    let angle = VectorNetwork.getAngle(
      new Vertex(10,  0),
      new Vertex(0,   0),
      new Vertex(-10, 0),
    );
    expect(angle).to.equal(Math.PI);
  });

  it('resolves 270 degree angles', function () {
    /*
    B-A
    |
    C
    */
    let angle = VectorNetwork.getAngle(
      new Vertex(10, 0),
      new Vertex(0, 0),
      new Vertex(0, -10),
    );
    expect(angle).to.equal(3 * Math.PI / 2);
  });

  it('resolves 90 degree angles (negative start)', function () {
    /*
      C
      |
    A-B
    */
    let angle = VectorNetwork.getAngle(
      new Vertex(0, -10),
      new Vertex(0, 0),
      new Vertex(10, 0),
    );
    expect(angle).to.equal(Math.PI / 2);
  });

  it('resolves 180 degree angles (negative start)', function () {
    /*
    A-B-C
    */
    let angle = VectorNetwork.getAngle(
      new Vertex(-10, 0),
      new Vertex(0,   0),
      new Vertex(10,  0),
    );
    expect(angle).to.equal(Math.PI);
  });

  it('resolves 270 degree angles (negative start)', function () {
    /*
    A-B
      |
      C
    */
    let angle = VectorNetwork.getAngle(
      new Vertex(-10,  0),
      new Vertex(0,    0),
      new Vertex(0,  -10),
    );
    expect(angle).to.equal(Math.PI / 2);
  });

  it('resolves acute angles', function () {
    /*
      C
     /
    B-A
    */
    let angle = VectorNetwork.getAngle(
      new Vertex(1, 0),
      new Vertex(0, 0),
      new Vertex(0, Math.sqrt(2)),
    );
    expect(angle).to.equal(Math.PI / 4);
  });

  it('resolves obtuse angles', function () {

  });
});
