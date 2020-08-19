const { app, BrowserWindow, ipcMain, dialog} = require('electron');
const { autoUpdater } = require('electron-updater');

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadFile('index.html');
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
  // mainWindow.openDevTools();
  mainWindow.webContents.on('did-finish-load', () => {
      autoUpdater.checkForUpdatesAndNotify();
      dialog.showMessageBox({message: 'update kontrol'});
  })
}

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});

autoUpdater.on('update-available', () => {
  dialog.showMessageBox({message: 'available'});
  mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox({message: 'download'});
  mainWindow.webContents.send('update_downloaded');
});

ipcMain.on('restart_app', () => {
  dialog.showMessageBox({message: 'restart'});
  autoUpdater.quitAndInstall();
});