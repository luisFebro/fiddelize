// Copyright 2015 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

function NotificationGenerator(requirementsElement, element) {
    NotificationGeneratorBase.call(this, requirementsElement, element);
}

NotificationGenerator.prototype = Object.create(
    NotificationGeneratorBase.prototype
);

// Creates the NotificationOptions dictionary based on the options in the
// generator. Default values will be added where necessary.
NotificationGenerator.prototype.createNotificationOptions = function (state) {
    // Note that the default values match those in the spec:
    // https://notifications.spec.whatwg.org/#dictdef-notificationoptions
    return {
        dir: this.getField(state, "dir", "auto"),
        // lang
        body: this.getField(state, "body", ""),
        tag: this.getField(state, "tag", ""),
        image: this.getField(state, "image", undefined),
        icon: this.getField(state, "icon", undefined),
        badge: this.getField(state, "badge", undefined),
        // sound
        vibrate: this.getField(state, "vibrate", undefined),
        timestamp: this.getField(state, "timestamp", undefined),
        renotify: this.getField(state, "renotify", false),
        actions: this.getField(state, "actions", undefined),
        silent: this.getField(state, "silent", false),
        // noscreen
        persistent: this.getField(state, "persistent", true),
        requireInteraction: this.getField(state, "requireInteraction", false),
        sticky: this.getField(state, "sticky", false),
        notificationCloseEvent: this.getField(
            state,
            "notificationCloseEvent",
            false
        ),
        showTrigger: this.getField(state, "showTrigger", undefined),

        data: {
            options: {
                action: this.getField(state, "action", "default"),
                close: this.getField(state, "close", true),
                notificationCloseEvent: this.getField(
                    state,
                    "notificationCloseEvent",
                    false
                ),
                url: document.location.toString(),
            },
        },
    };
};

// Displays the notification using the settings that have thus far been set.
// If not all requirements have been satisfied, the user will be alerted.
NotificationGenerator.prototype.display = function () {
    if (!this.verifyRequirements()) return;

    const state = this.computeState(true /* includeDefault */);
    if (!state.hasOwnProperty("title")) {
        alert("The notification must at least have a title.");
        return;
    }

    const title = state.title.value;
    const options = this.createNotificationOptions(state);
    const persistent = state.persistent.value;

    const promise = persistent
        ? this.displayPersistent(title, options)
        : this.displayNonPersistent(title, options);

    const self = this;
    return promise.then(() => {
        document.location.hash = self.serialize(
            self.computeState(false /* includeDefault */)
        );
    });
};

// Displays a persistent notification on the active Service Worker registration,
// and returns a Promise that will be settled when the operation is complete.
NotificationGenerator.prototype.displayPersistent = function (title, options) {
    return navigator.serviceWorker.ready
        .then((serviceWorker) => serviceWorker.showNotification(title, options))
        .catch((exception) => {
            alert(exception);
        });
};

// Displays a non-persistent notification using the Notification constructor,
// and returns a Promise that will be settled when the operation is complete.
NotificationGenerator.prototype.displayNonPersistent = function (
    title,
    options
) {
    return new Promise((resolve) => {
        let notification = null;
        try {
            notification = new Notification(title, options);
        } catch (exception) {
            alert(exception);
            return resolve();
        }

        notification.addEventListener("click", () => {
            const { action } = options.data.options;
            if (action == "message") {
                const message = `Clicked on "${notification.title}"`;
                alert(message);
            } else if (action == "default" || action == "focus-only") {
                // Focusing is the default option.
            } else {
                alert(`action not supported ${action}`);
            }

            if (options.data.options.close) {
                notification.close();
            }
        });

        notification.addEventListener("close", () => {
            if (options.data.options.notificationCloseEvent) {
                const message = `Closed "${notification.title}"`;
                alert(message);
            }
        });
        notification.addEventListener("show", () => {
            resolve();
        });

        notification.addEventListener("error", (error) => {
            alert(error);
            resolve();
        });
    });
};

NotificationGenerator.prototype.getPersistent = function () {
    return navigator.serviceWorker.ready
        .then((serviceWorker) =>
            serviceWorker.getNotifications().then((notifications) => {
                let notificationResult = "";
                for (let i = 0; i < notifications.length; ++i) {
                    notificationResult = notificationResult.concat(
                        notifications[i].title
                    );
                    if (i < notifications.length - 1)
                        notificationResult = notificationResult.concat(",");
                }
                alert(notificationResult);
            })
        )
        .catch((exception) => {
            alert(exception);
        });
};
