// reference: http://www.kirupa.com/html5/check_if_internet_connection_exists_in_javascript.htm
export default function isOffline() {
    const xhr = new XMLHttpRequest();
    const file = "https://www.fiddelize.com.br/img/error.png";
    const randomNum = Math.round(Math.random() * 10000);

    if (window.navigator.onLine) {
        return false;
    }

    xhr.open("HEAD", `${file}?rand=${randomNum}`, false);

    try {
        xhr.send();

        return !!(xhr.status >= 200 && xhr.status < 304);
    } catch (e) {
        return true;
    }
}

/* ARCHIVES
 // window.addEventListener('offline', () => {
    //     return true;
    // })

*/
