'use strict'

import assert from 'assert';
import mocha from 'mocha';

describe('mocha', () => {
  it('is exposed as global', () => {
    assert.strictEqual(window.mocha, mocha)
  })
})
