'use strict'

import Mocha from 'mocha';
import errors from 'mocha/lib/errors';
import { resolve }  from 'path';
import { existsSync }  from 'fs';
import {
  handleRequires,
  validateLegacyPlugin
}  from 'mocha/lib/cli/run-helpers';
import collectFiles from 'mocha/lib/cli/collect-files';
import { watchRun }  from 'mocha/lib/cli/watch-run';
import { ONE_AND_DONES }  from 'mocha/lib/cli/one-and-dones';

const cwd = process.cwd()

const handleLegacyRequires = async (mods) => {
  if (mods) {
    for (let mod of mods) {
      if (existsSync(mod, { cwd }) || existsSync(`${mod}.js`, { cwd })) {
        mod = resolve(mod)
      }
      require(mod)
    }
  }
}

const runMocha = async (argv, done) => {
  Error.stackTraceLimit = Infinity

  if (process.type === 'renderer') {
    // Node.js ESM loader is not available in Electron Renderer
    // so we require dependencies explicitly here.
    await handleLegacyRequires(argv.require)
  } else {
    await handleRequires(argv.require)
  }

  if (validateLegacyPlugin) {
    validateLegacyPlugin(argv, 'reporter', Mocha.reporters)
    validateLegacyPlugin(argv, 'ui', Mocha.interfaces)
  }

  const mocha = new Mocha(argv)

  if (argv.watch) {
    await watchRun(mocha, { ui: argv.ui }, argv)
  } else {
    mocha.files = collectFiles(argv)
    await mocha.run(done)
  }
}


export const Mocha = Mocha;

export const ONE_AND_DONES = ONE_AND_DONES;

export const errors = errors;

export const helpers = {
  handleRequires,
  handleLegacyRequires,
  runMocha
};
