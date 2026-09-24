import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const rootDir = path.resolve('.');

test('Task 1: Foundation files exist and contain required tokens', () => {
  const requiredFiles = [
    'index.html',
    'css/tokens.css',
    'css/base.css',
    'css/layout.css',
    'css/utilities.css'
  ];

  for (const file of requiredFiles) {
    assert.ok(fs.existsSync(path.join(rootDir, file)), `File ${file} should exist`);
  }

  const tokens = fs.readFileSync(path.join(rootDir, 'css/tokens.css'), 'utf-8');
  assert.ok(tokens.includes('--bg-primary'), 'tokens.css must define --bg-primary');
  assert.ok(tokens.includes('--text-primary'), 'tokens.css must define --text-primary');
  assert.ok(tokens.includes('--accent-primary'), 'tokens.css must define --accent-primary');
  assert.ok(tokens.includes('[data-theme="dark"]'), 'tokens.css must define dark theme overrides');

  const html = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
  assert.ok(html.includes('novaflow-theme'), 'index.html must include zero-FOUC theme script');
  assert.ok(html.includes('css/tokens.css'), 'index.html must link tokens.css');
});
