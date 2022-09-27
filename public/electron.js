const path = require("path")
const { app, ipcMain, BrowserWindow } = require("electron");
const isDev = require("electron-is-dev");
// const fs = require('fs').promises
const sqlite = require('better-sqlite3')


let installExtension, REACT_DEVELOPER_TOOLS;

if (isDev) {
  const devTools = require("electron-devtools-installer");
  installExtension = devTools.default;
  REACT_DEVELOPER_TOOLS = devTools.REACT_DEVELOPER_TOOLS;
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling
if (require("electron-squirrel-startup")) {
  app.quit();
}

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    autoHideMenuBar : true,
    width: 1500,
    height: 850,
    webPreferences: {
        preload : isDev ? path.join(__dirname, 'preload.js') : path.join(app.getAppPath(), "build", "preload.js"),
        contextIsolation : true,
        // webSecurity is disabled in dev because it can block system files reading
        webSecurity: isDev ? false : true
    },
  });

const filePath = path.join(`file://${path.join(__dirname, '../build/index.html')}`);
win.loadURL(isDev ? "http://localhost:3000" : filePath);


// Read and display the content of the folder containing the resources (extra folders)
// fs.readdir(process.resourcesPath).then((el) => console.log(el))

if (isDev) {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((error) => console.log(`An error occurred: , ${error}`));

    // Open the DevTools.
    win.webContents.on("did-frame-finish-load", () => {
      win.webContents.openDevTools({ mode: "detach" });
    });
  }
}

// This method will be called when Electron has finished initialization and is ready to create
// browser windows. Some APIs can only be used after this event occurs.
app.whenReady().then( createWindow );

// Quit when all windows are closed, except on macOS. There, it's common for applications and their
// menu bar to stay active until the user quits explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the dock icon is clicked and there
  // are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});


// ### Everything above is the basic configuration for electron
// Down there resides everything related to the database management

// Initializing a new database instance
// I would suggest to learn a bit more about better-sqlite3 
const db = new sqlite(
    isDev
      ? path.join(__dirname, '../db/test.db') // root folder if in dev mode
      : path.join(process.resourcesPath, 'db/tst.db') // the resources path if in production build
)

// Here's an example of the functions syntax to get all the data from the db
ipcMain.handle('get-infos', (event, args) => {
    const sql = "SELECT * FROM test_table"
    const stmt = db.prepare(sql)
    const rows = stmt.all()

    return rows
})
