import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { resolveHtmlPath } from './util';

import fs from 'fs';
import { Bot } from './bot';

type credentialsType = { user: string; passwd: string };

const sdpAdmin: credentialsType = { user: 'treetech', passwd: 'sd@admin#' };
const sdgAdmin: credentialsType = { user: 'admin', passwd: 'senh@Intern@' };
const standard: credentialsType = { user: 'default', passwd: 'Default123' };

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}
let mainWindow: BrowserWindow | null = null;
if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug = true;

if (isDebug) {
  require('electron-debug')();
}
const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};
const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1624,
    height: 828,
    icon: getAssetPath('icon.png'),
    frame: false,
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, './preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
      devTools: true,
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Create a menu bar
  // const menuBuilder = new MenuBuilder(mainWindow);
  // menuBuilder.buildMenu();

  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

// Window controller
ipcMain.on('closeApp', async (event, arg) => {
  mainWindow!.close();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
ipcMain.on('minimize', async (event, arg) => {
  mainWindow!.minimize();
});
ipcMain.on('maximize', async (event, arg) => {
  if (mainWindow!.isMaximized()) {
    mainWindow!.restore();
  } else {
    mainWindow!.maximize();
  }
});

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();

    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

// ? Listening from Renderer ? //

ipcMain.on(
  'system-update',
  async (
    event,
    data: {ip: string, status: string}[]
  ) => {
    console.log("System update")
    const bots = buildBot(data, sdpAdmin);

    bots.forEach((bot) => {
      updateSystem(bot, getLatestSdu());
    });
  }
);

ipcMain.on(
  'system-file',
  async (event, file: { filePath: string; fileName: string }) => {
    
    await fs.copyFile(
      file.filePath,
      `${__dirname}/archive/sduFiles/${file.fileName}`,
      (error: any) => {
        console.log(error);
      }
    );
    getSduList()
  }
);

ipcMain.on("sdu-files", async (event, data) => {
  await mainWindow!.webContents.send("sdu-response", getSduList()) 
})

// ? Apps function ? //

function getSduList(): string[] {
  const files = fs.readdirSync(path.join(__dirname, './archive/sduFiles'));
  console.log(files)
  return files;
}

function getLatestSdu(): string{
  const files = fs.readdirSync(path.join(__dirname, './archive/sduFiles'));
  if(files.length){

    return files.pop()!
  }else{

    return ""
  }
}

function buildBot(SDs: {ip: string, status: string}[], credentials: credentialsType): Bot[] {
  let bots: Bot[] = [];
  SDs.forEach((sd) => {
    bots.push(new Bot(sd.ip, credentials, mainWindow!));
  });

  return bots;
}

async function updateSystem(bot: Bot, fileName: string) {
  await mainWindow!.webContents.send("status-message", await bot.buildIntern())
  await mainWindow!.webContents.send("status-message", await bot.login())
  await bot.updateSystem(fileName);
}


