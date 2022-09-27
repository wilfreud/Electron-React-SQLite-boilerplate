const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // Invoke Methods (using .invoke instead of .send because it's more practical even tho there's no functional difference)
  getClients : (args) => {
    const response = ipcRenderer.invoke('get-infos', args)
    return response
  }

//  Here go all your other methods
})