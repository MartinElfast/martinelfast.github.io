# First look at <a href="https://threejs.org/">Three.js</a> 

### Part 1: Just a messy experiment scene.

Live demo: <a href="https://martinelfast.github.io/first/">https://martinelfast.github.io/first/</a>

### Part 2: Classic first person controls, look around with mouse and move with W,S,A,D keys.

Live demo: <a href="https://martinelfast.github.io/second/">https://martinelfast.github.io/second/</a>

Update: 1.3 million particles/sprites with transparent textures, camera draw distance 1000 @ 60fps (tested on laptop without GPU). 

Update: Ran into weird bugs with transparancy, turned out to be due to how OpenGL (thus also WebGL) renders transparent textures, the depthBuffer is sorted by z-index. Solved by turning off depthWrite and depthTest on the texture material.