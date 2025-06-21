const { app, BrowserWindow, ipcMain, systemPreferences } = require('electron');
const { createServer } = require('http');
const next = require('next');
const { parse } = require('url');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: __dirname + '/preload.js',
    },
    titleBarStyle: 'hiddenInset',
    show: false,
  });

  // Load the Next.js app
  if (dev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile('out/index.html');
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Handle accessibility permission requests
ipcMain.handle('request-accessibility-permissions', async () => {
  try {
    // Check if we're on macOS
    if (process.platform === 'darwin') {
      // Check current accessibility permission status
      const hasAccess = systemPreferences.isTrustedAccessibilityClient(false);
      
      if (!hasAccess) {
        // This will prompt the user and potentially open System Preferences
        const granted = systemPreferences.isTrustedAccessibilityClient(true);
        
        if (!granted) {
          // If still not granted, we can try to open System Preferences
          const { shell } = require('electron');
          try {
            // Open System Preferences to the Accessibility section
            await shell.openExternal('x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility');
          } catch (error) {
            console.log('Could not open System Preferences automatically');
          }
        }
        
        return granted;
      }
      
      return true;
    }
    
    // For non-macOS platforms, return true (no accessibility permissions needed)
    return true;
  } catch (error) {
    console.error('Error requesting accessibility permissions:', error);
    return false;
  }
});

// Handle microphone permission check (this is mainly handled by the browser)
ipcMain.handle('check-microphone-permissions', async () => {
  try {
    // On macOS, we can check microphone permissions
    if (process.platform === 'darwin') {
      const micStatus = systemPreferences.getMediaAccessStatus('microphone');
      return micStatus === 'granted';
    }
    
    // For other platforms, return true (browser will handle the permission)
    return true;
  } catch (error) {
    console.error('Error checking microphone permissions:', error);
    return false;
  }
});

app.whenReady().then(async () => {
  if (dev) {
    // In development, start the Next.js dev server
    await nextApp.prepare();
    
    const server = createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    });

    server.listen(3000, (err) => {
      if (err) throw err;
      console.log('> Ready on http://localhost:3000');
      createWindow();
    });
  } else {
    createWindow();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
}); 