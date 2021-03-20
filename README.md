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

## Implementation ideas
- Store data as nodes + edge graph
- Using typed arrays for storing data
- Taking inspiration from past work against SculptGL and other `<canvas>` based libraries
    - Split models separately from rendering

## Unlicense
As of Mar 20 2021, Todd Wolfson has released this repository and its contents to the public domain.

It has been released under the [UNLICENSE][].

[UNLICENSE]: UNLICENSE
