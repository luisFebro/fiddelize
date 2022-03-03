import { Fragment } from "react";
import useBackColor from "hooks/useBackColor";
import "./_Playground.scss";
// import Test from "./Test";

export default function Playground() {
    useBackColor("var(--mainWhite)");

    return (
        <Fragment>
            <h1 className="mx-3 text-title text-center my-5 text-purple">
                Playground for testing
            </h1>
            <main className="content"></main>
            <style jsx>
                {`
                    .content {
                        margin: 500px 0 500px;
                    }
                `}
            </style>
        </Fragment>
    );
}
