const { app, BrowserWindow, shell } = require('electron');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const distRoot = path.join(__dirname, 'dist');
const CATALYST_PORT = 48715;
const APP_ORIGIN = `http://127.0.0.1:${CATALYST_PORT}`;
let mainWindow = null;
let server = null;

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff2': 'font/woff2',
};

function resolveRequestPath(urlPath) {
  const pathname = decodeURIComponent((urlPath || '/').split('?')[0]);
  const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const candidate = path.normalize(path.join(distRoot, relative));  if (!candidate.startsWith(path.normalize(distRoot + path.sep))) return null;
  return candidate;
}

function startServer() {
  return new Promise((resolve, reject) => {
    const nextServer = http.createServer((req, res) => {
      let filePath = resolveRequestPath(req.url);
      if (!filePath) {
        res.writeHead(403).end('Forbidden');
        return;
      }
      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(distRoot, 'index.html');
      }
      fs.readFile(filePath, (error, data) => {
        if (error) {
          res.writeHead(500).end('Catalyst could not load this resource.');
          return;
        }
        res.writeHead(200, {
          'Content-Type': mime[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
          'Cache-Control': 'no-store',
          'X-Content-Type-Options': 'nosniff',
        });
        res.end(data);
      });
    });
    nextServer.once('error', reject);
    nextServer.listen(CATALYST_PORT, '127.0.0.1', () => resolve(nextServer));
  });
}
async function createWindow() {
  server = await startServer();

  const win = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 960,
    minHeight: 640,
    title: 'Catalyst',
    icon: path.join(__dirname, 'app-icon.png'),
    autoHideMenuBar: true,
    backgroundColor: '#101a2b',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow = win;
  win.on('closed', () => {
    if (mainWindow === win) mainWindow = null;
  });
  win.setMenu(null);

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//i.test(url) && !url.startsWith(APP_ORIGIN)) void shell.openExternal(url);
    return { action: 'deny' };
  });  win.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith(APP_ORIGIN)) {
      event.preventDefault();
      if (/^https?:\/\//i.test(url)) void shell.openExternal(url);
    }
  });

  await win.loadURL(APP_ORIGIN);
}

const gotSingleInstanceLock = app.requestSingleInstanceLock();
if (!gotSingleInstanceLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (!mainWindow) return;
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  });
}

app.whenReady().then(() => {
  if (!gotSingleInstanceLock) return;
  return createWindow();
}).catch((error) => {
  console.error(error);
  app.quit();
});

app.on('window-all-closed', () => {
  if (server) server.close();
  app.quit();
});