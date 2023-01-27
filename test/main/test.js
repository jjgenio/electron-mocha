'use strict'

import assert from 'assert';

describe('electron-mocha', () => {
  it('runs in main process by default', () => {
    assert.strictEqual(process.type, 'browser')
  })
})
