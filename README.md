# vector-network-playground
Playground for exploring for SVG-like vector networks, as built in Figma

This is very incomplete but demonstrates the concepts good enough

## Features
- Adding vertices
- Adding edges
- Detecting shortest cycles as faces
- Snapping to existing vertices

## Known bugs
- Faces are replaced on every click, thus the colors change often
- Shortest cycle detection works pretty good but does seem to break still

Missing functionality listed at bottom, since list can get long

## Documentation
### Terminology
- Point, x/y location on cartesian plane
- Vertex, point in a vector network
- Edge, 2 vertices in a vector network
- Face, cyclic collection of edges in a vector network

### Architecture
- We store our fundamental data as nodes and edges in a graph
- Data structures
  - Each data type is stored as its own class (e.g. `Vertex`, `Edge`, `Face`)
  - Initially we wanted to use typed arrays for storing our data (e.g. `Float32Array` for positions, `Uint8Array` for ids) but it added more complexity without immediate performance needs
    - To see this version, see: https://github.com/twolfson/vector-network-playground/blob/1.3.0/browser/js/data/vector-network.js
    - This is inspired by past work with [SculptGL][]

[SculptGL]: https://github.com/stephomi/sculptgl

### Implementation inspiration
Our implementation decisions have been heavily influenced by:

- SculptGL, https://github.com/stephomi/sculptgl
- Blueprint3D, https://github.com/furnishup/blueprint3d
- Polygon.js, https://github.com/tmpvar/polygon.js

### Missing functionality
- Multiple networks as independent layers
- Addition/removal of points
- Clicking/dragging of points
- Export support for SVG
  - Simplest version would be using same `Scene#render` commands but in an SVG
  - More complex versions would optimize for finding longest path and exporting edges as part of faces
- Rounding/curve handles
- Choosing your own color fills

## Unlicense
As of Mar 20 2021, Todd Wolfson has released this repository and its contents to the public domain.

It has been released under the [UNLICENSE][].

[UNLICENSE]: UNLICENSE
