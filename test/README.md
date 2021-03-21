# vector-network-playground
Test case scenarios we would want to build out:

- Clicking on a fresh canvas creates a new vertex and path
- While editing a path
  - Clicking on whitespace adds a new vertex to the path
  - Clicking on the same vertex closes the path
    - Does not create duplicate vertex on the path
  - Clicking on an existing vertex closes the path
    - Does add vertex to path
