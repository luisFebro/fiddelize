import { Fragment } from "react";
import "./_Playground.scss";
import useBackColor from "hooks/useBackColor";
import PricingTable from "./pricing-table/PricingTable";

export default function Playground() {
    useBackColor("var(--themeP)");

    return (
        <Fragment>
            <h1 className="mx-3 text-title text-center my-5 text-purple">
                Playground for testing
            </h1>
            <PricingTable />
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
