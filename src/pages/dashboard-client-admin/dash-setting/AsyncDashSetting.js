import { Fragment } from "react";
import { useStoreState } from "easy-peasy";
import DashSectionTitle from "../../DashSectionTitle";
import "./DashSetting.scss";
import ShowConfigExpansiblePanel from "./expansible-panel/ShowExpansiblePanel";
import PremiumServicesBtn from "./PremiumServicesBtn";
import { CLIENT_URL } from "../../../config/clientUrl";

const DashSettingTitle = <Title />;
// IMPLEMENT SOME CODE SPLITTING TO THE SETTING COMPONENTS
export default function DashSetting() {
    const showBizDocs = () => (
        <div className="d-flex justify-content-around align-items-center">
            <a
                className="text-link text-small"
                href={`${CLIENT_URL}/termos-de-uso`}
                rel="noopener noreferrer"
                target="_blank"
                color={{
                    color: "grey",
                }}
            >
                termos de uso
            </a>
            <a
                className="text-link text-small"
                href={`${CLIENT_URL}/privacidade`}
                rel="noopener noreferrer"
                target="_blank"
                color={{
                    color: "grey",
                }}
            >
                privacidade
            </a>
        </div>
    );

    return (
        <Fragment>
            <div style={{ marginTop: "16px", display: "block" }}>
                <DashSectionTitle title={DashSettingTitle} />
            </div>
            <main className="mt-2">
                <ShowConfigExpansiblePanel />
            </main>
            <PremiumServicesBtn />
            {showBizDocs()}
            <div style={{ marginBottom: 50 }} />
        </Fragment>
    );
}

function Title() {
    const bizName = useStoreState(
        (state) => state.userReducer.cases.clientAdmin.bizName
    );

    return (
        <Fragment>
            <span className="text-subtitle  font-weight-bold">
                Configurações da
                <br />
                <span className="text-title">{bizName && bizName.cap()}</span>
            </span>
        </Fragment>
    );
}
