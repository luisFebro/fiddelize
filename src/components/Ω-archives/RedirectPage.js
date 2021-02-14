import { useEffect, useState, useCallback } from "react";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";

RedirectPage.propTypes = {
    activated: PropTypes.bool,
    to: PropTypes.string,
    waitSec: PropTypes.number,
};

export default function RedirectPage({
    activated = false,
    to = "/",
    waitSec = 0,
}) {
    const [redirect, setRedirect] = useState(false);

    const timeToRedirect = useCallback(() => {
        const milisecs = waitSec * 1000;
        setTimeout(() => setRedirect(true), milisecs);
    }, [waitSec]);

    useEffect(() => {
        timeToRedirect();
    }, [timeToRedirect]);

    const needRedirect = () => activated && redirect && <Redirect to={to} />;

    return <div>{needRedirect()}</div>;
}

/* COMMENTS
n1: references:
before
useEffect(() => {
    let unmounted = false; // n1
    if(!unmounted) {
        timeToRedirect();
    }
    return () => { unmounted = true }
}, [])
this was not necessary. The error was because I was rendering timeToRedirect(). Instead, used useEffect
https://www.robinwieruch.de/react-warning-cant-call-setstate-on-an-unmounted-component
https://stackoverflow.com/questions/58038008/how-to-stop-memory-leak-in-useeffect-hook-react
*/
