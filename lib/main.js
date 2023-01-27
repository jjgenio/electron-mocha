'use strict'

import { join, resolve  } from 'path';
import { mkdtempSync } from 'fs';
import { spawn } from 'child_process';
import { app } from 'electron';
import { version } from '../package.json';
import { yargs } from 'yargs/yargs';
import ansi from 'ansi-colors';
import { types } from 'mocha/lib/cli/run-option-metadata';
import { loadOptions, YARGS_PARSER_CONFIG } from 'mocha/lib/cli/options';
import run from './run.js';

// Add Electron-Mocha types to ensure they're known when
// parsing options from config files
types.array.push('require-main', 'script')
types.boolean.push('renderer', 'interactive')

// Main entry point
// See: mocha/lib/cli/cli.js
exports.main = (argv = process.argv.slice(2)) => {
  module.paths.push(process.cwd(), resolve('node_modules'))

  const args = loadOptions(argv)

  yargs()
    .scriptName('electron-mocha')
    .command(run)
    .fail((msg, err, yargs) => {
      yargs.showHelp()
      console.error(`\n${ansi.red('ERROR:')} ${msg}`)
      if (err) console.error(err.stack)
      app.exit(1)
    })
    .help('help', 'Show usage information and exit')
    .alias('help', 'h')
    .version('version', 'Show version number and exit', version)
    .alias('version', 'V')
    .wrap(process.stdout.columns ? Math.min(process.stdout.columns, 80) : 80)
    .parserConfiguration(YARGS_PARSER_CONFIG)
    .config(args)
    .parse(args._)
}

// Setup User-Data in tmp
const userData = mkdtempSync(join(app.getPath('temp'), 'electron-mocha-'))
app.setPath('userData', userData)

// Clean-up in a separate process so that we're not
// removing Electron's data out from under it
app.on('quit', () => {
  const child = spawn(process.execPath, ['cleanup.js', userData], {
    detached: true,
    stdio: 'ignore',
    env: { ELECTRON_RUN_AS_NODE: 1 },
    cwd: __dirname
  })
  child.unref()
})

// Do not quit if tests open and close windows
app.on('window-all-closed', () => {})

if (require.main === module) {
  exports.main()
}
