export default function isOffline() {
    window.addEventListener('offline', () => {
        alert("Parece que você está offline no momento.")
        return true;
    })

    if(window.navigator.onLine) {
        return false;
    }
}


/*ARCHIVES


return true;
*/