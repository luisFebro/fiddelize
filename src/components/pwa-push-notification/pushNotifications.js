/*
Requesting Permission
A Promise that resolves to a DOMString with the permission picked by the user. Possible values for this string are:
default - The user hasn't been asked for permission yet, so notifications won't be displayed.
granted - The user has granted permission to display notifications, after having been asked previously.
denied - The user has explicitly declined permission to show notifications.

Users should explicitly agree with notifications by some user gesture like clicking a button
at least once, the user needs to specifically grant that application permission to present notifications, thereby letting the user control which apps/sites are allowed to display notifications.
 In Chrome and Firefox you cannot request notifications at all unless the site is a secure context (i.e. HTTPS), and you can no longer allow notification permissions to be requested from cross-origin <iframe>s.

https://developer.mozilla.org/en-US/docs/Web/API/Notification/requestPermission
https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API
 */
export function showPermissionBanner() {
    if (!("Notification" in window)) {
        console.log("This browser does not support notification");
        return false;
    }

    const { permission } = Notification;

    if (permission === "default") {
        return true;
    }

    if (permission === "granted" || permission === "denied") {
        return false;
    }

    return false;
}

/*
The getNotifications() method of the ServiceWorkerRegistration interface returns a list of the notifications in the order that they were created from the current origin via the current service worker registration. Origins can have many active but differently-scoped service worker registrations. Notifications created by one service worker on the same origin will not be available to other active services workers on that same origin.
returns an empty array if nothing
https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/getNotificationsThe getNotifications() method of the ServiceWorkerRegistration interface returns a list of the notifications in the order that they were created from the current origin via the current service worker registration. Origins can have many active but differently-scoped service worker registrations. Notifications created by one service worker on the same origin will not be available to other active services workers on that same origin.
 */
export async function getNotifications(options = {}) {
    const { tag = "id456" } = options;
    return navigator.serviceWorker.ready.then((registration) =>
        registration.getNotifications({ tag })
    );
}

/*
run a check to see whether the promise-based version of Notification.requestPermission() is supported. If it is, we run the promise-based version (supported everywhere except Safari), and if not, we run the older callback-based version (which is supported in Safari).
https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API
 */
export async function requestPermission() {
    if (checkNotificationPromise()) {
        return await Notification.requestPermission();
    }

    // for safari
    return Notification.requestPermission(function (permission) {
        console.log(permission);
    });
}

/*
https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification
 */
const isSmall = window.Helper.isSmallScreen();
export default async function showNotification(options = {}) {
    const {
        id = "id456",
        title = "Cliente ganhou um desafio",
        body = "Erica bateu 500 pontos e ganhou um par de ingresso",
        badge = "/img/logo-push-notif.png",
        icon = "/img/test/vocariza.png",
        image,
        vibrate = [200, 100, 200, 100, 200, 100, 200], // n1
        renotify = false, // A boolean that indicates whether to suppress vibrations and audible alerts when reusing a tag value. If options’s renotify is true and options’s tag is the empty string a TypeError will be thrown. The default is false.
        silent = false,
        dir = "ltr",
        lang = "pt-br", // Specify the lang used within the notification. This string must be a valid BCP 47 language tag.
        data, // Arbitrary data that you want to be associated with the notification. This can be of any data type.
    } = options;

    if (!("Notification" in window)) {
        console.log("This browser does not support notification");
        return false;
    }
    const { permission } = Notification;
    if (permission !== "granted") return false;

    const registration = await navigator.serviceWorker.ready;

    const config = {
        tag: id, //  An ID for a given notification that allows you to find, replace, or remove the notification using a script if necessary.
        body,
        badge, // the icon alongside the site's url right in the right corner -  a USVString containing the URL of an image to represent the notification when there is not enough space to display the notification itself such as for example, the Android Notification Bar. On Android devices, the badge should accommodate devices up to 4x resolution, about 96 by 96 px, and the image will be automatically masked.
        icon, // the icon inside the message in the left corner (can be the customer biz's logo)
        image, // the body image - a USVString containing the URL of an image to be displayed in the notification.
        requireInteraction: isSmall, // only on mobile - Indicates that on devices with sufficiently large screens, a notification should remain active until the user clicks or dismisses it. If this value is absent or false, the desktop version of Chrome will auto-minimize notifications after approximately twenty seconds. The default value is false.
        actions: [
            {
                title: "acessar app",
                icon: "/img/logo.png", // the left side icon from the title
                action:
                    "<a href=`http://localhost:3000/t/app/nucleo-equipe` target=`_self` />",
            },
        ],
        data,
        vibrate,
        renotify,
        silent,
        dir,
        lang,
    };

    return registration.showNotification(title, config);
}

// HELPERS
function checkNotificationPromise() {
    try {
        Notification.requestPermission().then();
    } catch (e) {
        return false;
    }

    return true;
}
// END HELPERS

/* COMMENTS
n1:  A vibration pattern to run with the display of the notification. A vibration pattern can be an array with as few as one member. The values are times in milliseconds where the even indices (0, 2, 4, etc.) indicate how long to vibrate and the odd indices indicate how long to pause. For example, [300, 100, 400] would vibrate 300ms, pause 100ms, then vibrate 400ms.
<option data-id="0" value="">No vibration</option>
<option data-id="1" value="10000">Single long buzz</option>
<option data-id="2" value="100,50,100,50,100,50,100,50,100,50,100,50,100,50,100,50,100,50,100,50">Repetitive buzzing</option>
<option data-id="0" value="">---------------</option>
<option data-id="3" value="125,75,125,275,200,275,125,75,125,275,200,600,200,600">Super Mario</option>
<option data-id="4" value="500,110,500,110,450,110,200,110,170,40,450,110,200,110,170,40,500">Star Wars</option>
<option data-id="5" value="100,200,100,100,75,25,100,200,100,500,100,200,100,500">Shave and a Haircut</option>
<option data-id="6" value="0,300,100,50,100,50,100,50,100,50,100,50,100,50,150,150,150,450,100,50,100,50,150,150,150,450,100,50,100,50,150,150,150,450,150,150">Smooth Criminal</option>
<option data-custom value="custom">Custom</option>
*/
