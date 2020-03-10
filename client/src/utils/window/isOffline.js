export default function isOffline() {
    window.addEventListener('offline', () => {
        return true;
    })

    if(window.navigator.onLine) {
        return false;
    }
}


/*ARCHIVES


return true;
*/