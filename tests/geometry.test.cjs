const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../prototype/workbench.fragment.html'), 'utf8');
const start = source.indexOf('  function knots(n)');
const end = source.indexOf('  const evaluate=', start);
assert.ok(start >= 0 && end > start, 'find the actual pure curve routines in prototype source');
const context = vm.createContext({});
vm.runInContext(source.slice(start, end), context);
const { knots, casteljau, deBoor } = context;
const near = (a, b, eps = 1e-10) => {
  assert.equal(a.length, b.length);
  a.forEach((value, i) => assert.ok(Math.abs(value - b[i]) < eps, `${value} differs from ${b[i]}`));
};

// Independent Bernstein polynomial oracle, separate from recursive interpolation.
function bernstein(points, t) {
  const s = 1 - t;
  const weights = [s ** 3, 3 * s * s * t, 3 * s * t * t, t ** 3];
  return [0, 1].map(axis => weights.reduce((sum, w, i) => sum + w * points[i][axis], 0));
}

// Independent Cox-de Boor basis sum oracle for the de Boor point evaluator.
function basis(i, p, t, u) {
  if (p === 0) return u[i] <= t && t < u[i + 1] ? 1 : 0;
  const a = u[i + p] - u[i], b = u[i + p + 1] - u[i + 1];
  return (a ? (t - u[i]) / a * basis(i, p - 1, t, u) : 0) +
    (b ? (u[i + p + 1] - t) / b * basis(i + 1, p - 1, t, u) : 0);
}

const controls = Array.from({ length: 12 }, (_, i) => [0.7 + Math.sin(i) * 0.2, -1.5 + i * 3 / 11]);

test('Bézier endpoints interpolate the first and final control points', () => {
  const p = [[1, -1], [0.3, 0], [0.5, 1], [0.7, 2]];
  near(casteljau(p, 0), p[0]); near(casteljau(p, 1), p[3]);
});

test('de Casteljau agrees with the independent cubic Bernstein expression', () => {
  const p = [[0.95, -1.5], [0.3, -0.4], [0.6, 0.8], [0.8, 1.5]];
  for (let i = 0; i <= 100; i++) near(casteljau(p, i / 100), bernstein(p, i / 100));
});

test('clamped B-spline endpoints and knot-vector dimensions', () => {
  const u = knots(controls.length);
  assert.equal(u.length, controls.length + 4);
  assert.ok(u.every((x, i) => i === 0 || x >= u[i - 1]));
  near(deBoor(controls, 0), controls[0]); near(deBoor(controls, 1), controls.at(-1));
});

test('de Boor agrees with a basis-sum oracle across interior knots', () => {
  const u = knots(controls.length);
  for (let sample = 0; sample < 200; sample++) {
    const t = sample / 200;
    const weights = controls.map((_, i) => basis(i, 3, t, u));
    assert.ok(Math.abs(weights.reduce((a, b) => a + b, 0) - 1) < 1e-10);
    near(deBoor(controls, t), [0, 1].map(axis => weights.reduce((sum, w, i) => sum + w * controls[i][axis], 0)));
  }
});

test('moving one B-spline control point has no effect outside its support', () => {
  const changed = controls.map(p => p.slice()); changed[5][0] += 0.4;
  const u = knots(controls.length), low = u[5], high = u[9];
  let affected = 0;
  for (let i = 0; i <= 200; i++) {
    const t = i / 200, a = deBoor(controls, t), b = deBoor(changed, t);
    if (t < low || t > high) near(a, b);
    else if (Math.abs(a[0] - b[0]) > 1e-8) affected++;
  }
  assert.ok(affected > 0, 'edit actually changes the curve inside the support');
});

test('a cubic B-spline with four clamped controls equals a cubic Bézier', () => {
  const p = controls.slice(0, 4);
  for (let i = 0; i <= 100; i++) near(deBoor(p, i / 100), casteljau(p, i / 100));
});

test('coincident controls yield finite constant curves', () => {
  const p = Array.from({ length: 12 }, () => [0.5, 0.25]);
  for (let i = 0; i <= 40; i++) near(deBoor(p, i / 40), [0.5, 0.25]);
});

test('all prototype browser scripts parse without executing browser APIs', () => {
  const scripts = [...source.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  assert.ok(scripts.length > 0);
  for (const script of scripts) new vm.Script(script[1]);
  assert.ok(!/window\.openai\.(?!widgetState|setWidgetState)[A-Za-z]+/.test(source));
});
