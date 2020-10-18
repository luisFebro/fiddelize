// reference: https://codepen.io/RCMiron/pen/bYPqPp
import React, { Fragment, useEffect } from "react";
import "./_Lock.scss";

export default function Lock({
    backColor,
    needUnlock = false,
    isLockLoading = false,
}) {
    useEffect(() => {
        if (needUnlock) loadLock({ isLockLoading });
    }, [needUnlock, isLockLoading]);

    return (
        <section className="mt-2 container-center">
            <div className="wrapper">
                <ShowSvgLock backColor={backColor} />
            </div>
        </section>
    );
}

const unlock = () => {
    setTimeout(function () {
        const lockElems = document.querySelectorAll(".lock");
        if (lockElems) {
            lockElems.forEach((l) => {
                l.classList.toggle("loading");
            });
            const lockTopElem = document.querySelector(".lock-top");
            lockTopElem.classList.toggle("loaded");
        }
    }, 2000);
};

function loadLock({ isLockLoading }) {
    const lockElems = document.querySelectorAll(".lock");
    if (lockElems) {
        lockElems.forEach((l) => {
            l.classList.toggle("loading");
        });

        !isLockLoading && unlock();
    }
}

function ShowSvgLock({ backColor }) {
    const showLockTop = () => (
        <path
            y="50"
            className="lock lock-top"
            d="M64,50V18.7C64,12,58.9,6.6,52.6,6.6h-3.5c-6.3,0-11.3,5.4-11.3,12.1v25.9"
        />
    );

    const showLockOutline = () => (
        <Fragment>
            <circle
                style={{ fill: backColor }}
                cx="50.9"
                cy="65.4"
                r="27" // r = radius or size of the circle
            />
            <circle cx="50.9" cy="65.4" r="20" style={{ fill: "#fff" }} />
        </Fragment>
    );

    const showLockBody = () => (
        <path
            className="lock lock-body"
            d="M50.9,41.4c-13.2,0-24,10.7-24,24c0,13.2,10.7,24,24,24c13.2,0,24-10.7,24-24C74.9,52.2,64.1,41.4,50.9,41.4z M56.2,61.9
            c-1.1,1.5-1.3,3-1.3,4.8c0.1,3,0.1,6.1,0,9.1c-0.1,2.8-1.6,4.4-4,4.5c-2.5,0.1-4.3-1.6-4.5-4.4c-0.1-1.9,0-3.9,0-5.8c0,0,0,0,0,0
            c0-1.4,0.1-2.8,0-4.2c-0.2-1.3-0.5-2.7-1.2-3.8c-1.5-2.7-1.1-6.3,1.1-8.3c2.4-2.2,6-2.3,8.6-0.2C57.3,55.5,58,59.2,56.2,61.9z"
        />
    );

    const showLockSpinner = () => (
        <path
            className="lock lock-spinner"
            d="M73.3,65.7c0,12.2-9.9,22.1-22.1,22.1"
        >
            <animateTransform
                attributeType="xml"
                attributeName="transform"
                type="rotate"
                from="0 50.9 65.4"
                to="360 50.9 65.4"
                dur="0.8s"
                repeatCount="indefinite"
            />
        </path>
    );

    return (
        <svg
            viewBox="0 0 100 100" //n1 viewBox
            className="shake-it"
        >
            {showLockTop()}
            {showLockOutline()}
            {showLockBody()}
            {showLockSpinner()}
        </svg>
    );
}

/* COMMENTS
n1:
definition:
The viewBox attribute defines the position and dimension, in user space, of an SVG viewport.

The value of the viewBox attribute is a list of four numbers:
min-x, min-y,
width and height. The numbers separated by whitespace and/or a comma, which specify a rectangle in user space which is mapped to the bounds of the viewport established for the associated SVG element
*/
