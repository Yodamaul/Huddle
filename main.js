// Modules to control application life and create native browser window
const {
  ipcMain,
  ipcRenderer,
  app,
  BrowserWindow
} = require("electron");
const path = require("path");
global["PeopleInChat"] = 0;
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

ipcMain.on("changePeople", (event, myGlobalVariableValue) => {
  global.PeopleInChat = myGlobalVariableValue;
});

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    frame: false,
    closeable: true,
    minimizable: true,
    maximizable: true,
    resizable: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile("index.html");

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on("closed", function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

var app2 = require('express')();
var http = require('http').createServer(app2);
var io = require('socket.io')(http);

io.on('connection', function (socket) {

  global["PeopleInChat"] = global["PeopleInChat"] + 1;
  mainWindow.webContents.send('ping', global["PeopleInChat"]);
  console.log('a user connected');

  socket.on('disconnect', function () {
    global["PeopleInChat"] = global["PeopleInChat"] - 1;
    mainWindow.webContents.send('ping', global["PeopleInChat"]);
    console.log('user disconnected');
  });

  socket.on('chat message', function (msg) {
    io.emit('chat message', msg);
  });


});
http.listen(3000, function () {
  console.log('listening on *:3000');
});