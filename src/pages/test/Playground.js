import { Fragment } from "react";
import useBackColor from "hooks/useBackColor";
import FaniVPN from "./fani-vpn/FaniVPN";
import "./_Playground.scss";
// import Test from "./Test";

export default function Playground() {
    useBackColor("#00020f");

    return (
        <Fragment>
            <FaniVPN />
        </Fragment>
    );
}

/*
<MagicNavMenuIndicator />


TEMPLATE

<Fragment>
    <h1 className="mx-3 text-title text-center my-5 text-white">
        Playground for testing
    </h1>
    <main>
        <MagicNavMenuIndicator />
    </main>
    <div className="" />
    <style jsx>
        {`
            .spacing {
                margin: 500px 0 500px;
            }
        `}
    </style>
</Fragment>

 */
