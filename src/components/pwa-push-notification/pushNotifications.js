export * from "./notifSchemas";
/*
TWO TECHNOLOGIES
Push and notification use different, but complementary, APIs: push is invoked when a server supplies information to a service worker; a notification is the action of a service worker or web page script showing information to a user.
https://developers.google.com/web/fundamentals/push-notifications

REQUESTING PERMISSION
A Promise that resolves to a DOMString with the permission picked by the user. Possible values for this string are:
default - The user hasn't been asked for permission yet, so notifications won't be displayed.
granted - The user has granted permission to display notifications, after having been asked previously.
denied - The user has explicitly declined permission to show notifications.

Users should explicitly agree with notifications by some user gesture like clicking a button
at least once, the user needs to specifically grant that application permission to present notifications, thereby letting the user control which apps/sites are allowed to display notifications.
 In Chrome and Firefox you cannot request notifications at all unless the site is a secure context (i.e. HTTPS), and you can no longer allow notification permissions to be requested from cross-origin <iframe>s.

NOTIFICATION EVENTS
There are four events that are triggered on the Notification instance:

click - Triggered when the user clicks on the notification.
close - Triggered once the notification is closed.
error - Triggered if something goes wrong with the notification; this is usually because the notification couldn't be displayed for some reason.
show - Triggered when the notification is displayed to the user.
These events can be tracked using the onclick, onclose, onerror, and onshow handlers. Because Notification also inherits from EventTarget, it's possible to use the addEventListener() method on it.

REPLACING EXISTING NOTIFICATIONS - default behavior if the same tag
It is usually undesirable for a user to receive a lot of notifications in a short space of time — for example, what if a messenger application notified a user for each incoming message, and they were being sent a lot? To avoid spamming the user with too many notifications, it's possible to modify the pending notifications queue, replacing single or multiple pending notifications with a new one.
To do this, it's possible to add a tag to any new notification. If a notification already has the same tag and has not been displayed yet, the new notification replaces that previous notification. If the notification with the same tag has already been displayed, the previous notification is closed and the new one is displayed.

A persistent notification is a notification with an associated service worker registration.
Actions are only currently supported for persistent notifications.
If options’s silent is true and options’s vibrate is present, throw a TypeError exception.
If options’s renotify is true and options’s tag is the empty string, throw a TypeError exception.

https://notifications.spec.whatwg.org/
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
    return Notification.requestPermission((permission) => {
        console.log(permission);
    });
}

/*
https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification
 */
const isSmall = window.Helper.isSmallScreen();
export default async function showNotification(options = {}) {
    const {
        tag, // if no id is passed, then notification will show up multiple times even if the same category of message.
        // visual options
        title = "💎 Cliente completou um jogo",
        body = "Erica bateu 500 pontos e ganhou um par de ingresso",
        badge = "/img/push-notif/logo-push-notif.png", // should be a transparent img - the icon alongside the site's url right in the right corner - The badge is a small monochrome icon that is used to portray a little more information to the user about where the notification is from -  a USVString containing the URL of an image to represent the notification when there is not enough space to display the notification itself such as for example, the Android Notification Bar. On Android devices, the badge should accommodate devices up to 4x resolution, about 96 by 96 px, and the image will be automatically masked.
        icon = "https://res.cloudinary.com/fiddelize/image/upload/v1602079714/cheries-beauty-chrffp932.png",
        image,
        dir = "ltr",
        vibrate = [200, 100, 200, 100, 200, 100, 200], // n1
        sound = "/sounds/gift-box-opening.mp3", // The sound parameter allows you to define a sound to play when the notification is received. - no browser support yet
        // behavior options
        renotify = false, // A boolean that indicates whether to suppress vibrations and audible alerts when reusing a tag value. If options’s renotify is true and options’s tag is the empty string a TypeError will be thrown. - This largely applies to mobile devices at the time of writing. Setting this option makes new notifications vibrate and play a system sound. - There are scenarios where you might want a replacing notification to notify the user rather than silently update. Chat applications are a good example. In this case, you should set tag and renotify to true.
        silent = false, // This is ideal if your notifications don't require immediate attention from the user. - If you define both silent and renotify, silent will take precedence.
        lang = "pt-BR", // Specify the lang used within the notification. This string must be a valid BCP 47 language tag.
        data, // Arbitrary data that you want to be associated with the notification. This can be of any data type.
        actions, // an array with objects
    } = options;

    if (!("Notification" in window)) {
        console.log("This browser does not support notification");
        return false;
    }
    const { permission } = Notification;
    if (permission !== "granted") return false;

    const registration = await navigator.serviceWorker.ready;

    const config = {
        tag, //  An ID for a given notification that allows you to find, replace, or remove the notification using a script if necessary. - The tag option is simply a way of grouping messages so that any old notifications that are currently displayed will be closed if they have the same tag as a new notification. A subtlety to using tag is that when it replaces a notification, it will do so without a sound or vibration.
        body,
        badge,
        icon, // the icon inside the message in the left corner (can be the customer biz's logo)
        image, // the body image - a USVString containing the URL of an image to be displayed in the notification.
        sound,
        requireInteraction: isSmall, // only on mobile - Indicates that on devices with sufficiently large screens, a notification should remain active until the user clicks or dismisses it. If this value is absent or false, the desktop version of Chrome will auto-minimize notifications after approximately twenty seconds. The default value is false.
        actions, // n2 array with objects - only works on mobile android - it does not appear in the desktop - the left side icon from the title
        data,
        vibrate,
        renotify,
        silent,
        dir,
        lang,
    };

    checkBrowserMaxActions();

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

function checkBrowserMaxActions() {
    // how many action buttons can be placed in a notification in the current browser.
    const maxVisibleActions = Notification.maxActions;
    if (maxVisibleActions < 4) {
        console.log(
            `This notification will only display ${maxVisibleActions} actions.`
        );
    } else {
        console.log(
            `This notification can display up to ${maxVisibleActions} actions.`
        );
    }
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

n2:
For each action you can define a title, an "action" (which is essentially an ID) and an icon. The title and icon is what you can see in the notification.
[
{
    action: "app-access", // this is the id which we can identify which button was clicked to trigger some action
    title: "acessar app",
    icon: "/img/push-notif/star.png",
},
]

https://developers.google.com/web/fundamentals/push-notifications/display-a-notification
*/
