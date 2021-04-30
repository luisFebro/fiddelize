import { Fragment } from "react";
import DashSectionTitle from "../../DashSectionTitle";
import "./_AsyncTeam.scss";
import { useStoreState } from "easy-peasy";
import OptionsHandler from "./OptionsHandler";

export default function AsyncTeam() {
    return (
        <Fragment>
            <div className="async-title">
                <DashSectionTitle title={<Title />} />
            </div>
            <OptionsHandler />
        </Fragment>
    );
}

function Title() {
    const bizName = useStoreState(
        (state) => state.userReducer.cases.bizData.bizName
    );

    return (
        <Fragment>
            <span className="text-subtitle  font-weight-bold">
                Equipe da
                <br />
                <span className="text-title">{bizName && bizName.cap()}</span>
            </span>
        </Fragment>
    );
}
