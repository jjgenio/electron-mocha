#!/usr/bin/env node

'use strict'

import { join } from 'path';
import { spawn } from 'child_process';
import * as url from 'url';
import electronModule from 'electron';
import electronPreBuiltModule from 'electron-prebuilt';

const electron =
  process.env.ELECTRON_PATH ||
  electronModule ||
  electronPreBuiltModule

if (!electron) {
  console.error('')
  console.error('  Can not find `electron` in $PATH and $ELECTRON_PATH is not set.')
  console.error('  Please either set $ELECTRON_PATH or `npm install electron`.')
  console.error('')
  process.exit(1)
}

run(electron)

/* function resolve (module, resolver) {
  try {
    return (resolver || require)(module)
  } catch (_) {
    // ignore
  }
} */

function run (electron) {
  let args = [
    join(url.fileURLToPath(new URL('.', import.meta.url)), '../lib/main.js'),
    ...process.argv.slice(2)
  ]

  let child = spawn(electron, args)

  // stdio 'inherit' not work reliably in Renderer!
  child.stdout.pipe(process.stdout)
  child.stderr.pipe(process.stderr)
  process.stdin.pipe(child.stdin)

  child.on('exit', (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal)
    } else {
      process.exit(code)
    }
  })

  process.on('SIGINT', () => {
    child.kill('SIGINT')
    child.kill('SIGTERM')
  })
}
