import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { loadInFile, getProjects } from './utils/projectsReader';
import { importProject, deleteProject, openExplorer } from './utils/projectsHandler';
import { obfuscateTargetProject } from "./utils/obfuscatior";
import { evaluateTargetFile } from "./utils/evaluator";

let mainWindow;

function createWindow(): void {

  // Create the browser window.
  mainWindow = new BrowserWindow({
    icon: icon,
    show: false,
    resizable: false,
    frame: false,
    transparent: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.maximize();

  let intervalId;

  intervalId = setInterval(() => {
    if (!mainWindow.isMaximized() && !mainWindow.isMinimized()) {
      mainWindow.maximize();
    }
  }, 1);

  mainWindow.on('closed', () => {
    clearInterval(intervalId);
    intervalId = null;
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  ipcMain.handle('obfuscate', async (_event, directoryPath: string, projectName: string) => {
    obfuscateTargetProject(mainWindow, directoryPath, projectName);
  });

  ipcMain.handle('evaluate', async (_event, directoryPath: string, projectName: string, fileName: string) => {
    evaluateTargetFile(mainWindow, directoryPath, projectName, fileName);
  });

  ipcMain.handle('import', async (_event, directoryPath: string) => {
    importProject(mainWindow, directoryPath);
  });

  ipcMain.handle('explorer', (_event, directoryPath: string) => {
    openExplorer(directoryPath);
  });

  ipcMain.handle('delete-projects', async (_event, directoryPath: string, projectName: string) => {
    deleteProject(mainWindow, directoryPath, projectName);
  });

  ipcMain.handle('reload', () => {
    if (mainWindow) {
      mainWindow.reload(); // reload
    }
  });

  ipcMain.handle('exit', () => {
    if (mainWindow) {
      app.quit() // quit
    }
  });

  ipcMain.handle('minimize', () => {
    if (mainWindow) {
      mainWindow.minimize(); // minimize
    }
  });

  // Get a list of projects
  ipcMain.handle('get-projects', async (_event, directoryPath: string) => {
    return getProjects(directoryPath);
  });

  ipcMain.handle('log-file-content', async (_event, filePath: string) => {
    return loadInFile(filePath);
  });

  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})