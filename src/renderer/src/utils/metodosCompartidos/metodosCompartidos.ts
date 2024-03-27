const reiniciarFlujometros = ():void => {
    window.electron.ipcRenderer.send('reiniciarFlujometros')
}
export {
    reiniciarFlujometros
}