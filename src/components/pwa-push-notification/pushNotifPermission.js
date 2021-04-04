import { showSnackbar } from "../../redux/actions/snackbarActions";
import subscribeUser from "./subscription";

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
run a check to see whether the promise-based version of Notification.requestPermission() is supported. If it is, we run the promise-based version (supported everywhere except Safari), and if not, we run the older callback-based version (which is supported in Safari).
https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API
 */
export default async function requestPermission({
    dispatch,
    setBackDrop,
    userId,
    role,
    deviceType,
}) {
    const defaultData = {
        dispatch,
        userId,
        role,
        deviceType,
    };

    if (checkNotificationPromise()) {
        const permission = await Notification.requestPermission();

        setBackDrop(false);

        await handlePermission({ permission, ...defaultData });
        return "ok";
    }

    // for safari or browsers which does not support promise, but callbacks
    Notification.requestPermission((permission) => {
        setBackDrop(false);
        handlePermission({ permission, ...defaultData });
        return "ok";
    });

    return false;
}

// HELPERS
async function handlePermission({
    deviceType,
    permission,
    dispatch,
    userId,
    role,
}) {
    const isGranted = permission === "granted";
    const isDenied = permission === "denied";

    if (isDenied) {
        showSnackbar(
            dispatch,
            "Se precisar ativar depois, vá em ajustes > notificações",
            "warning",
            6000
        );
    }

    if (!isGranted) return;

    showSnackbar(dispatch, "Registrando...", "warning");

    const data = await subscribeUser({
        userId,
        role,
        deviceType,
    }).catch((err) => {
        showSnackbar(dispatch, `${err}`, "error");
    });
    if (!data) return;

    showSnackbar(dispatch, "Notificações ativadas!", "success");
}

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


n3:
The getNotifications() method of the ServiceWorkerRegistration interface returns a list of the notifications in the order that they were created from the current origin via the current service worker registration. Origins can have many active but differently-scoped service worker registrations. Notifications created by one service worker on the same origin will not be available to other active services workers on that same origin.
returns an empty array if nothing
useful for merging notifications - https://developers.google.com/web/fundamentals/push-notifications/common-notification-patterns
https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/getNotificationsThe getNotifications() method of the ServiceWorkerRegistration interface returns a list of the notifications in the order that they were created from the current origin via the current service worker registration. Origins can have many active but differently-scoped service worker registrations. Notifications created by one service worker on the same origin will not be available to other active services workers on that same origin.
*/
