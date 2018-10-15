import path from 'path';
import { app, crashReporter, BrowserWindow, Menu, ipcMain } from 'electron';

const isDevelopment = process.env.NODE_ENV === 'development';

let mainWindow = null;
let backgroundWindow = null;
let forceQuit = false;
let progressBar = null;

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  for (const name of extensions) {
    try {
      await installer.default(installer[name], forceDownload);
    } catch (e) {
      console.log(`Error installing ${name} extension: ${e.message}`);
    }
  }
};

crashReporter.start({
  productName: 'Jacob Kittley',
  companyName: 'Kittley Ltd',
  submitURL: 'https://your-domain.com/url-to-submit',
  uploadToServer: false,
});

app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

function init() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    minWidth: 640,
    minHeight: 480,
    show: false,
  });

  backgroundWindow = new BrowserWindow({
    width: 200,
    height: 100,
		show: false
  });

  const menuTemplate = [
    {
      label: 'HashTag Literature',
      submenu: [
        {
          label: 'About',
          click: () => {
              mainWindow.webContents.send('transitionTo', '/about');
          }
        },
        {
          type: 'separator'
        },
        {
            label: 'Settings',
            click: () => {
                mainWindow.webContents.send('transitionTo', '/settings');
            }
        },
        {
          label: 'Reset Data',
          click: () => {
              mainWindow.webContents.send('transitionTo', '/reset');
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Quit',
          click: () => {
              quit();
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)

  mainWindow.loadFile(path.resolve(path.join(__dirname, '../renderer/index.html')));
  backgroundWindow.loadFile(path.resolve(path.join(__dirname, '../background/index.html')));

  // show window once on first load
  mainWindow.webContents.once('did-finish-load', () => {
    mainWindow.show();
  });

  // share messages
  mainWindow.webContents.once('did-finish-load', () => {
    ipcMain.on('bgmessage', (event, payload) => {
      backgroundWindow.webContents.send('bgmessage', payload);
    });
  });
  backgroundWindow.webContents.once('did-finish-load', () => {
    ipcMain.on('fgmessage', (event, payload) => {
      mainWindow.webContents.send('fgmessage', payload);
    });
  });

  // On window close
  mainWindow.webContents.on('did-finish-load', () => {
      mainWindow.on('closed', () => {
        quit();
      });
  });

  if (isDevelopment) {
    // auto-open dev tools
    // mainWindow.webContents.openDevTools();
    // backgroundWindow.webContents.openDevTools();

    // add inspect element on right click menu
    mainWindow.webContents.on('context-menu', (e, props) => {
      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click() {
            mainWindow.inspectElement(props.x, props.y);
            backgroundWindow.webContents.openDevTools();
          },
        },
      ]).popup(mainWindow);
    });
  }
}

function quit() {
  mainWindow = null;
  backgroundWindow = null;
  if (progressBar!==null) progressBar.close();
  progressBar = null;
  app.quit();
}


app.on('ready', async () => {
  if (isDevelopment) {
    await installExtensions();
  }
  init();
});
