import { Link } from "react-router-dom";
import { Fragment } from "react";
import { useStoreState } from "easy-peasy";
import DashSectionTitle from "../../DashSectionTitle";
import "./DashSetting.scss";
import ShowConfigExpansiblePanel from "./expansible-panel/ShowExpansiblePanel";
import PremiumServicesBtn from "./PremiumServicesBtn";
import { CLIENT_URL } from "../../../config/clientUrl";
import isThisApp from "../../../utils/window/isThisApp";

const isApp = isThisApp();

const DashSettingTitle = <Title />;
// IMPLEMENT SOME CODE SPLITTING TO THE SETTING COMPONENTS
export default function DashSetting() {
    const showBizDocs = () => (
        <section>
            <div className="d-flex justify-content-around align-items-center">
                <a
                    className="text-link text-small"
                    href={`${CLIENT_URL}/termos-de-uso`}
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    termos de uso
                </a>
                <a
                    className="text-link text-small"
                    href={`${CLIENT_URL}/privacidade`}
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    privacidade
                </a>
            </div>
            <Link
                to="/status-de-servicos"
                className="mt-4 container-center text-link text-small"
            >
                status de serviços
            </Link>
        </section>
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
            {isApp && showBizDocs()}
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
