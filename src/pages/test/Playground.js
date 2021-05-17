import { Fragment } from "react";
import "./_Playground.scss";
import useBackColor from "hooks/useBackColor";
import QrScanner from "./QrScanner";

export default function Playground() {
    // useBackColor("var(--mainWhite)");

    return (
        <Fragment>
            <h1 className="mx-3 text-title text-center my-5 text-purple">
                Playground for testing
            </h1>
            <section className="content">
                <QrScanner />
            </section>
            <style jsx>
                {`
                    .content {
                        margin: 150px 0 500px;
                    }
                `}
            </style>
        </Fragment>
    );
}
