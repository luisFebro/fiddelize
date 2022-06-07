import { Fragment } from "react";
import useBackColor from "hooks/useBackColor";
import FaniVPN from "./fani-vpn/FaniVPN";
import MagicNavMenuIndicator from "./ref-codes/online-tut/magic-nav-menu-indicator/MagicNavMenuIndicator";
import "./_Playground.scss";
// import Test from "./Test";

export default function Playground() {
    useBackColor("var(--mainWhite)");

    return (
        <Fragment>
            <h1 className="mx-3 text-title text-center my-5 text-purple">
                Playground for testing
            </h1>
            <main>
                <MagicNavMenuIndicator />
            </main>
            <div className="spacing" />
            <style jsx>
                {`
                    .spacing {
                        margin: 500px 0 500px;
                    }
                `}
            </style>
        </Fragment>
    );
}
