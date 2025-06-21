const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  requestAccessibilityPermissions: () => ipcRenderer.invoke('request-accessibility-permissions'),
  checkMicrophonePermissions: () => ipcRenderer.invoke('check-microphone-permissions'),
  platform: process.platform,
}); 