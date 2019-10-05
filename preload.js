// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const remote = require('electron').remote;
const IPFS = require('ipfs-mini');
const ip = require('ip')

const Crypto = require("crypto")
let address = ip.address();
const ipfs = new IPFS({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https'
});
const Store = require('electron-store');

window.store = new Store();

require('electron').ipcRenderer.on('ping', (event, message) => {
  console.log(user.people) // Prints 'whoooooooh!'
})

function keyGen(input) {
  var ip = address;
  var number = parseInt(ip[ip.length - 1]);
  var key = input.substring(number, number + 32);
  return key
}

window.obfuscate = function (clearText) {
  var iv = Crypto.randomBytes(16);
  const salt = keyGen(user.hash);
  const hash = Crypto.createHash("sha1");

  hash.update(salt);
  let key = hash.digest().slice(0, 16);

  var cipher = Crypto.createCipheriv('aes-128-cbc', key, iv);
  var encrypted = cipher.update(clearText);
  var finalBuffer = Buffer.concat([encrypted, cipher.final()]);
  //Need to retain IV for decryption, so this can be appended to the output with a separator (non-hex for this example)
  var encryptedHex = iv.toString('hex') + ':' + finalBuffer.toString('hex')
  return encryptedHex;
};

window.unobfuscate = function (encryptedHex) {
  var encryptedArray = encryptedHex.split(':');
  var iv = new Buffer(encryptedArray[0], 'hex');
  const salt = keyGen(user.hash);
  const hash = Crypto.createHash("sha1");

  hash.update(salt);
  let key = hash.digest().slice(0, 16);
  var encrypted = new Buffer(encryptedArray[1], 'hex');
  var decipher = Crypto.createDecipheriv('aes-128-cbc', key, iv);
  var decrypted = decipher.update(encrypted);
  var clearText = Buffer.concat([decrypted, decipher.final()]).toString();
  return clearText
};

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