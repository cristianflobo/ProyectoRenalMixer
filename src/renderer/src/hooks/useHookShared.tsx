
const useHookShared = () => {
    const eviarProcesoPines = (procesoIO:TioPeripheral[]) => {
        window.electron.ipcRenderer.send("procesoPinesSalida", procesoIO);
      };
  return {eviarProcesoPines}
}

export default useHookShared