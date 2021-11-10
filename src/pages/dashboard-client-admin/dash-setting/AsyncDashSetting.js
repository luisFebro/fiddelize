import { Link } from "react-router-dom";
import { Fragment } from "react";
import { useBizData } from "init";
import DashSectionTitle from "../../DashSectionTitle";
import "./DashSetting.scss";
import ShowConfigExpansiblePanel from "./expansible-panel/ShowExpansiblePanel";
import { CLIENT_URL } from "../../../config/clientUrl";
import isThisApp from "../../../utils/window/isThisApp";

const isApp = isThisApp();

const DashSettingTitle = <Title />;
// IMPLEMENT SOME CODE SPLITTING TO THE SETTING COMPONENTS
export default function DashSetting() {
    const showBizDocs = () => (
        <section className="font-site text-normal">
            <div className="my-5 d-flex justify-content-around align-items-center">
                <a
                    className="text-link"
                    href={`${CLIENT_URL}/termos-de-uso`}
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    termos de uso
                </a>
                <a
                    className="text-link"
                    href={`${CLIENT_URL}/privacidade`}
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    privacidade
                </a>
            </div>
            <Link
                to="/status-de-servicos"
                className="mt-2 container-center text-link"
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
            {isApp && showBizDocs()}
            <div style={{ marginBottom: 50 }} />
        </Fragment>
    );
}

function Title() {
    const { bizName } = useBizData();

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
