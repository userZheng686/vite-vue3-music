export const openPath = (path: string) => {
    if (window.desktopMainAPI) {
        window.desktopMainAPI.openPath(path)
    }
} 