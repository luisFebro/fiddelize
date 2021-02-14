/*!
 * Toastify js 1.6.2
 * https://github.com/apvarun/toastify-js
 * @license MIT licensed
 *
 * Copyright (C) 2018 Varun A P
 */
(function (root, factory) {
    if (typeof module === "object" && module.exports) {
        module.exports = factory();
    } else {
        root.Toastify = factory();
    }
})(this, (global) => {
    // Object initialization
    var Toastify = function (options) {
        // Returning a new init object
        return new Toastify.lib.init(options);
    };
    // Library version
    const version = "1.6.2";

    // Defining the prototype of the object
    Toastify.lib = Toastify.prototype = {
        toastify: version,

        constructor: Toastify,

        // Initializing the object with required parameters
        init(options) {
            // Verifying and validating the input object
            if (!options) {
                options = {};
            }

            // Creating the options object
            this.options = {};

            this.toastElement = null;

            // Validating the options
            this.options.text = options.text || "Hi there!"; // Display message
            this.options.duration = options.duration || 3000; // Display duration
            this.options.selector = options.selector; // Parent selector
            this.options.callback = options.callback || function () {}; // Callback after display
            this.options.destination = options.destination; // On-click destination
            this.options.newWindow = options.newWindow || false; // Open destination in new window
            this.options.close = options.close || false; // Show toast close icon
            this.options.gravity =
                options.gravity == "bottom"
                    ? "toastify-bottom"
                    : "toastify-top"; // toast position - top or bottom
            this.options.positionLeft = options.positionLeft || false; // toast position - left or right
            this.options.position = options.position || ""; // toast position - left or right
            this.options.backgroundColor = options.backgroundColor; // toast background color
            this.options.avatar = options.avatar || ""; // img element src - url or a path
            this.options.className = options.className || ""; // additional class names for the toast
            this.options.stopOnFocus =
                options.stopOnFocus === undefined ? true : options.stopOnFocus; // stop timeout on focus
            this.options.onClick = options.onClick; // Callback after click
            // my own props
            this.options.fontWeight = options.fontWeight;
            this.options.needActionBtn = options.needActionBtn;
            this.options.actionBtnText = options.actionBtnText;
            // end my own props
            // Returning the current object for chaining functions
            return this;
        },

        // Building the DOM element
        buildToast() {
            // Validating if the options are defined
            if (!this.options) {
                throw "Toastify is not initialized";
            }

            // Creating the DOM object
            const divElement = document.createElement("div");
            divElement.className = `toastify on ${this.options.className}`;

            // Positioning toast to left or right or center
            if (this.options.position) {
                divElement.className += ` toastify-${this.options.position}`;
            } else {
                // To be depreciated in further versions
                if (this.options.positionLeft === true) {
                    divElement.className += " toastify-left";
                    console.warn(
                        "Property `positionLeft` will be depreciated in further versions. Please use `position` instead."
                    );
                } else {
                    // Default position
                    divElement.className += " toastify-right";
                }
            }

            // Assigning gravity of element
            divElement.className += ` ${this.options.gravity}`;

            if (this.options.backgroundColor) {
                divElement.style.background = this.options.backgroundColor;
            }

            if (this.options.fontWeight) {
                divElement.style.fontWeight = this.options.fontWeight;
            }

            // Adding an action button to the text.
            if (this.options.needActionBtn) {
                const p = document.createElement("p");
                p.style.textAlign = "left";
                p.innerHTML = this.options.text;
                divElement.appendChild(p);
                const br = document.createElement("br");
                divElement.appendChild(br);
                divElement.appendChild(br.cloneNode());
                const divBtnAction = document.createElement("div");
                divBtnAction.appendChild(br);
                divBtnAction.style.cssText =
                    "display: block; margin: 0px 10px;";
                const btnAction = document.createElement("button");
                btnAction.style.cssText =
                    "background-color: #000; border: none; color: #fff; font-weight: bold;";
                btnAction.innerHTML = this.options.actionBtnText;
                divBtnAction.appendChild(btnAction);
                divElement.appendChild(divBtnAction);

                // remove toast when click on button
                divBtnAction.addEventListener("click", (event) => {
                    event.stopPropagation();
                    this.removeElement(this.toastElement);
                    window.clearTimeout(this.toastElement.timeOutValue);
                    this.options.onClick();
                });
            } else {
                // Adding the toast message
                divElement.innerHTML = this.options.text;
            }

            if (this.options.avatar !== "") {
                const avatarElement = document.createElement("img");
                avatarElement.src = this.options.avatar;

                avatarElement.className = "toastify-avatar";

                if (
                    this.options.position == "left" ||
                    this.options.positionLeft === true
                ) {
                    // Adding close icon on the left of content
                    divElement.appendChild(avatarElement);
                } else {
                    // Adding close icon on the right of content
                    divElement.insertAdjacentElement(
                        "beforeend",
                        avatarElement
                    );
                }
            }

            // Adding a close icon to the toast
            if (this.options.close === true) {
                // Create a span for close element
                const closeElement = document.createElement("span");
                closeElement.innerHTML = "&#10006;";

                closeElement.className = "toast-close";

                // Triggering the removal of toast from DOM on close click
                closeElement.addEventListener("click", (event) => {
                    event.stopPropagation();
                    this.removeElement(this.toastElement);
                    window.clearTimeout(this.toastElement.timeOutValue);
                });

                // Clear timeout while toast is focused
                if (this.options.stopOnFocus && this.options.duration > 0) {
                    const self = this;
                    // stop countdown
                    divElement.addEventListener("mouseover", (event) => {
                        window.clearTimeout(divElement.timeOutValue);
                    });
                    // add back the timeout
                    divElement.addEventListener("mouseleave", () => {
                        divElement.timeOutValue = window.setTimeout(() => {
                            // Remove the toast from DOM
                            self.removeElement(divElement);
                        }, self.options.duration);
                    });
                }

                // Calculating screen width
                const width =
                    window.innerWidth > 0
                        ? window.innerWidth
                        : window.screen.width;

                // Adding the close icon to the toast element
                // Display on the right if screen width is less than or equal to 360px
                if (
                    (this.options.position == "left" ||
                        this.options.positionLeft === true) &&
                    width > 360
                ) {
                    // Adding close icon on the left of content
                    divElement.insertAdjacentElement(
                        "afterbegin",
                        closeElement
                    );
                } else {
                    // Adding close icon on the right of content
                    divElement.appendChild(closeElement);
                }
            }

            // Adding an on-click destination path
            if (typeof this.options.destination !== "undefined") {
                divElement.addEventListener("click", (event) => {
                    event.stopPropagation();
                    if (this.options.newWindow === true) {
                        window.open(this.options.destination, "_blank");
                    } else {
                        window.location = this.options.destination;
                    }
                });
            }

            if (
                typeof this.options.onClick === "function" &&
                typeof this.options.destination === "undefined"
            ) {
                divElement.addEventListener("click", (event) => {
                    event.stopPropagation();
                    this.options.onClick();
                });
            }

            // Returning the generated element
            return divElement;
        },

        // Displaying the toast
        showToast() {
            // Creating the DOM object for the toast
            this.toastElement = this.buildToast();

            // Getting the root element to with the toast needs to be added
            let rootElement;
            if (typeof this.options.selector === "undefined") {
                rootElement = document.body;
            } else {
                rootElement = document.getElementById(this.options.selector);
            }

            // Validating if root element is present in DOM
            if (!rootElement) {
                throw "Root element is not defined";
            }

            // Adding the DOM element
            rootElement.insertBefore(this.toastElement, rootElement.firstChild);

            // Repositioning the toasts in case multiple toasts are present
            Toastify.reposition();

            if (this.options.duration > 0) {
                this.toastElement.timeOutValue = window.setTimeout(() => {
                    // Remove the toast from DOM
                    this.removeElement(this.toastElement);
                }, this.options.duration); // Binding `this` for function invocation
            }

            // Supporting function chaining
            return this;
        },

        hideToast() {
            if (this.toastElement.timeOutValue) {
                clearTimeout(this.toastElement.timeOutValue);
            }
            this.removeElement(this.toastElement);
        },

        // Removing the element from the DOM
        removeElement(toastElement) {
            // Hiding the element
            // toastElement.classList.remove("on");
            toastElement.className = toastElement.className.replace(" on", "");

            // Removing the element from DOM after transition end
            window.setTimeout(() => {
                // Remove the elemenf from the DOM
                toastElement.parentNode.removeChild(toastElement);

                // Calling the callback function
                this.options.callback.call(toastElement);

                // Repositioning the toasts again
                Toastify.reposition();
            }, 400); // Binding `this` for function invocation
        },
    };

    // Positioning the toasts on the DOM
    Toastify.reposition = function () {
        // Top margins with gravity
        const topLeftOffsetSize = {
            top: 15,
            bottom: 15,
        };
        const topRightOffsetSize = {
            top: 15,
            bottom: 15,
        };
        const offsetSize = {
            top: 15,
            bottom: 15,
        };

        // Get all toast messages on the DOM
        const allToasts = document.getElementsByClassName("toastify");

        let classUsed;

        // Modifying the position of each toast element
        for (let i = 0; i < allToasts.length; i++) {
            // Getting the applied gravity
            if (containsClass(allToasts[i], "toastify-top") === true) {
                classUsed = "toastify-top";
            } else {
                classUsed = "toastify-bottom";
            }

            const height = allToasts[i].offsetHeight;
            classUsed = classUsed.substr(9, classUsed.length - 1);
            // Spacing between toasts
            const offset = 15;

            const width =
                window.innerWidth > 0 ? window.innerWidth : window.screen.width;

            // Show toast in center if screen with less than or qual to 360px
            if (width <= 360) {
                // Setting the position
                allToasts[i].style[classUsed] = `${offsetSize[classUsed]}px`;

                offsetSize[classUsed] += height + offset;
            } else if (containsClass(allToasts[i], "toastify-left") === true) {
                // Setting the position
                allToasts[i].style[
                    classUsed
                ] = `${topLeftOffsetSize[classUsed]}px`;

                topLeftOffsetSize[classUsed] += height + offset;
            } else {
                // Setting the position
                allToasts[i].style[
                    classUsed
                ] = `${topRightOffsetSize[classUsed]}px`;

                topRightOffsetSize[classUsed] += height + offset;
            }
        }

        // Supporting function chaining
        return this;
    };

    function containsClass(elem, yourClass) {
        if (!elem || typeof yourClass !== "string") {
            return false;
        }
        if (
            elem.className &&
            elem.className.trim().split(/\s+/gi).indexOf(yourClass) > -1
        ) {
            return true;
        }
        return false;
    }

    // Setting up the prototype for the init object
    Toastify.lib.init.prototype = Toastify.lib;

    // Returning the Toastify function to be assigned to the window object/module
    return Toastify;
});
