import { Fragment } from "react";
import GreetingsAndWorkingHourMsg from "./GreetingsAndWorkingHourMsg";
import WorkingHourTable from "./WorkingHourTable";
import StoreMap from "./StoreMap";
import ButtonCart from "../../components/buttons/ButtonCart";

export default function Store() {
    return (
        <Fragment>
            <GreetingsAndWorkingHourMsg />
            <StoreMap />
            <WorkingHourTable />
            <ButtonCart />
        </Fragment>
    );
}
