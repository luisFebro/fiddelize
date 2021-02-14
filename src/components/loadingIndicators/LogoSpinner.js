import { Fragment, useState, useEffect } from "react";
import Spinner from "./Spinner";

export default function LogoSpinner({ delay = 2000, marginY = 600 }) {
    const [isPageReady, setPageReady] = useState(false);

    useEffect(() => {
        setTimeout(() => setPageReady(true), delay);
    }, []);

    const showSpinner = () =>
        !isPageReady && <Spinner marginY={marginY} size="large" logo="white" />;

    return <Fragment>{showSpinner()}</Fragment>;
}
