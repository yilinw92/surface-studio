# Prototype validation

Validated locally on 2026-10-16. This record concerns the JavaScript / WebGL prototype; no native C++ / OpenGL executable exists in this repository yet.

| Check | Observed result |
| --- | --- |
| Curve and script tests | 8 Node.js tests passed |
| Independent formulas | de Casteljau agrees with the cubic Bernstein expression; de Boor agrees with a Cox-de Boor basis-sum oracle |
| Local support | Moving P5 changes the curve inside its support and preserves values outside it |
| Special cases | Endpoint interpolation, four-control Bézier equivalence, and coincident controls passed |
| Build reproducibility | `python tools/build_preview.py --check` passed |
| Standalone operation | Exported `index.html` opened from a localhost server in Edge and rendered a nonempty 3D model |
| Editing and rendering | P5 radius changed from 0.72 to 0.80; viewport switched to wireframe; values and lit mode restored |
| Portability | The exported file requires no remote script downloads; only widgetState/setWidgetState compatibility hooks remain |

The prototype UI image in `docs/media/product-preview.jpg` was captured from the standalone project running locally. Numerical tests and build checks run in GitHub Actions; browser rendering was checked manually, not through a claimed native/GPU CI suite.

The sample model is synthetic. No performance numbers, industrial deployment, Jetson test, physical machining approval, or native C++ implementation are claimed by these checks.
