import { ipcMain, app } from 'electron';

global.requiredMain = true
global.requiredMainBeforeReady = !app.isReady()

ipcMain.handle('get-global', async (event, name) =>
  global[name]
)
