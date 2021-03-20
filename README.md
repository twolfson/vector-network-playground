# vector-network-playground
Playground for exploring for SVG-like vector networks, as built in Figma

## Target functionality
- Add/remove new networks as independent layers
- Add/remove points in vectors
- Export support for SVG

### Bonus functionality
- Snapping cursor to lines, might actually be needed for closing loops
- Click + drag existing points
- Exploring/better understanding vector rounding handles
- Filling areas that are faces/closed loops

## Implementation ideas
- Store data as nodes + edge graph
- Using typed arrays for storing data
- Taking inspiration from past work against SculptGL and other `<canvas>` based libraries
  - Split models separately from rendering
  - https://github.com/stephomi/sculptgl/blob/a004d3051b29134f7a97943fc98eabdebe222fc0/src/mesh/Mesh.js
  - vertexCount = n
  - verticesXY = Uint8Array[x_1, y_1, ... x_n, y_n]
  - edgeCount = m
  - edges = Uint8Array[pair_1_start, pair_1_end, ..., pair_m_start, pair_m_end]
  - faceCount = a
  - Faces don't have well-defined count, unsure how to handle that yet...
    - Maybe we guarantee edges are ordered somehow? and only say the start/end edge?
    - faces = Uint8Array[face_1_start_edge, face_1_end_edge, face_a_start_edge, face_a_end_edge]
      - Unfortunately, this won't work since we have reuse of edges since we're in a network...
      - We could duplicate the edge though? Kind of defeats the purpose a little bit though...
    - Bonus: face_fills_enabled = BooleanArray[face_1_enabled, ... face_a_enabled]
    - Bonus: face_fills = Uint32Array[face_1_hex_color, ..., face_a_hex_color]
      - For reusing known colors, can change `enabled` to an enum and have a different array for saying which style is being used
- Open questions:
  - What's performance of addition/removal of a vertex?
    - Do we clone it? Slice it? Splice it?
    - Typed arrays support `subarray()` which reuses the same buffer (thus no new memory allocation)
    - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/subarray
    - This doesn't really answer question though...
    - Not a lot of addition/removal tools in SculptGL, more reshaping
    - Dynamic meshes do answer some quesitions though, https://github.com/stephomi/sculptgl/blob/a004d3051b29134f7a97943fc98eabdebe222fc0/src/mesh/dynamic/MeshDynamic.js#L190-L201
    - Resizing underlying array buffers at 2x increments
    - There we go, remove and replace logic - https://github.com/stephomi/sculptgl/blob/a004d3051b29134f7a97943fc98eabdebe222fc0/src/misc/Utils.js#L40-L57
      - https://github.com/stephomi/sculptgl/blob/a004d3051b29134f7a97943fc98eabdebe222fc0/src/mesh/dynamic/Subdivision.js#L52-L53
    - The answer for a resize becomes `O(n)` performance, which is kind of poor... but I guess we can never do better for removing a vertex from edges...
    - Alright, cool. Good enough to move forward
  - What's performance of addition/removal of an edge?
  - What's performance of addition/removal of a face?

- Bonus: For better click detection resolution, use a quadtree - like how SculptGL likes an octree https://github.com/stephomi/sculptgl/blob/a004d3051b29134f7a97943fc98eabdebe222fc0/src/mesh/MeshData.js#L77

## Unlicense
As of Mar 20 2021, Todd Wolfson has released this repository and its contents to the public domain.

It has been released under the [UNLICENSE][].

[UNLICENSE]: UNLICENSE
