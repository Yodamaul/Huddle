// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const remote = require('electron').remote;
const IPFS = require('ipfs-mini');
const ip = require('ip')
let address = ip.address();
const ipfs = new IPFS({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https'
});
const Store = require('electron-store');

window.store = new Store();



window.storeIP = function () {
  var obj = {};
  obj['ip'] = address;

  ipfs.addJSON(obj, (err, result) => {
    DATA.hash = result;
    DATA.ip = address;
  });

};

window.retrieveData = function (key) {
  ipfs.catJSON(key).then(function (val) {
    DATA.ip = val.ip;
  })

};

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
  for (const type of ['hash']) {
    replaceText('hashcode', window.store.get("user").hash)
  }



  window.minpg = function () {
    let window = remote.getCurrentWindow();
    window.minimize();
  };

  window.togpg = function (e) {
    var window = remote.getCurrentWindow();

    if (!TMP.maximized) {
      TMP.maximized = true
      window.maximize();
    } else {
      console.log(TMP);
      TMP.maximized = false;
      window.unmaximize();
    }
  };

  window.closepg = function (e) {
    let window = remote.getCurrentWindow();
    window.close();
  };

})