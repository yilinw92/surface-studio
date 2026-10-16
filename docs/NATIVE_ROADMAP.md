# Native C++ / OpenGL roadmap

All checkboxes below are planned work, not claims of implemented functionality. The repository currently contains the WebGL prototype.

## Milestone 1 — one complete native editing operation

- [ ] C++17/20 + CMake application, OpenGL 3.3 context and Dear ImGui docking workspace.
- [ ] Independent curve library: de Casteljau, de Boor, knot/degree validation and derivatives.
- [ ] Revolved indexed surface with interior walls, end rings and well-defined normals/seams.
- [ ] Orbit camera, model/view/projection transforms and lit/wireframe/normal/depth modes.
- [ ] Move-only RAII ownership for shaders, buffers, VAOs and framebuffers.
- [ ] Document state, stable object IDs, command-based undo/redo, save/open and input diagnostics.
- [ ] Native numerical tests and real GPU framebuffer captures on a stated environment.

Acceptance: edit a B-spline control point, observe the updated native mesh, inspect its normals and depth, undo the change, save the document, and reopen the same geometry.

## Milestone 2 — geometry depth

- [ ] Knot insertion with a measured shape-invariance check.
- [ ] Adaptive curve/surface tessellation with an explicit geometric error criterion.
- [ ] Local dirty-span invalidation with clear cache dependencies.
- [ ] A bicubic Bézier patch or B-spline surface editing example.
- [ ] Surface seam, derivative, degenerate input and numerical tolerance tests.

## Milestone 3 — rendering and concurrency

- [ ] Framebuffer object-ID picking and selection visualization.
- [ ] Shadow mapping and a documented material/lighting model.
- [ ] Revision-tagged CPU mesh jobs; discard outdated results after further edits.
- [ ] Upload and release all OpenGL resources on the owning render thread.
- [ ] Separate CPU build/upload timings from GPU query timings.

Proposed native modules are `geometry`, `document`, `render` and `editor`. UI code consumes the geometry API; the renderer consumes immutable CPU mesh data; worker jobs do not call OpenGL. Library dependencies and original contributions must remain explicit in the README.
