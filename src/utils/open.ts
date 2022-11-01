export function initOpenFile(){
    if(window.ipcRenderer?.openFile) {
        window.ipcRenderer.openFile((result : any) => {
            console.log('result',result)
        })
    }
}