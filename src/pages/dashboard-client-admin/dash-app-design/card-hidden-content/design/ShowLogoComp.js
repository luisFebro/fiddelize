import { Fragment } from "react";
import PickLogo from "../../../../new-app/self-service/pickers/PickLogo";
import { useBizData } from "init";
import BackButton from "../../../../../components/buttons/BackButton";

export default function ShowLogoComp({ openComp, onBackBtnClick }) {
    const { bizId, bizLinkName } = useBizData();

    const showBackBtn = () => (
        <div className="d-flex justify-content-start">
            <BackButton title="Voltar Opções" onClick={onBackBtnClick} />
        </div>
    );

    return (
        <section>
            {openComp === "logo" && (
                <Fragment>
                    {showBackBtn()}
                    <div
                        className="animated zoomIn container-center text-purple text-hero"
                        style={{ margin: "50px 0px 0px" }}
                    >
                        <PickLogo
                            bizId={bizId}
                            bizLinkName={bizLinkName}
                            isFromDash
                        />
                    </div>
                </Fragment>
            )}
        </section>
    );
}
