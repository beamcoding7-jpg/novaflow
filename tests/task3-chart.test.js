import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateBezierCurvePath, buildAreaChartSvg, renderAreaChart } from '../js/utils/chart-engine.js';

test('generateBezierCurvePath computes valid cubic bezier SVG path commands', () => {
  const points = [
    { x: 0, y: 100 },
    { x: 50, y: 40 },
    { x: 100, y: 80 }
  ];
  const pathD = generateBezierCurvePath(points);
  assert.ok(pathD.startsWith('M 0,100'), 'Path must begin with MoveTo first point');
  assert.ok(pathD.includes('C'), 'Path must contain Cubic Bezier commands (C)');
});

test('generateBezierCurvePath handles empty and single-point arrays', () => {
  assert.strictEqual(generateBezierCurvePath([]), '');
  assert.strictEqual(generateBezierCurvePath([{ x: 10, y: 20 }]), 'M 10,20');
});

test('buildAreaChartSvg returns complete SVG with gradient and stroke path', () => {
  const data = [10, 25, 45, 30, 60, 85, 95];
  const result = buildAreaChartSvg({
    data,
    width: 600,
    height: 240,
    gradientId: 'test-chart-gradient'
  });

  const { strokeD, fillD, svgMarkup, points } = result;

  assert.ok(strokeD.startsWith('M'), 'strokeD should be a valid SVG path');
  assert.ok(fillD.endsWith('Z'), 'fillD must close path with Z');
  assert.ok(svgMarkup.includes('<svg'), 'svgMarkup must be valid svg string');
  assert.ok(svgMarkup.includes('test-chart-gradient'), 'svgMarkup must include specified gradient');
  assert.strictEqual(points.length, data.length, 'Points array should have same length as data');

  // Verify compatibility aliases
  assert.strictEqual(result.pathD, strokeD, 'pathD should equal strokeD');
  assert.strictEqual(result.areaD, fillD, 'areaD should equal fillD');
  assert.strictEqual(result.svgString, svgMarkup, 'svgString should equal svgMarkup');
});

test('renderAreaChart alias is exported and behaves identically', () => {
  assert.strictEqual(typeof renderAreaChart, 'function');
  const data = [5, 15, 25];
  const res1 = buildAreaChartSvg({ data, gradientId: 'chart-g' });
  const res2 = renderAreaChart({ data, gradientId: 'chart-g' });
  assert.strictEqual(res1.strokeD, res2.strokeD);
  assert.strictEqual(res1.fillD, res2.fillD);
});
