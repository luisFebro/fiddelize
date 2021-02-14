import { Fragment } from "react";
import PickLogo from "../../../../new-app/self-service/pickers/PickLogo";
import { useAppSystem, useClientAdmin } from "../../../../../hooks/useRoleData";
import BackButton from "../../../../../components/buttons/BackButton";

export default function ShowLogoComp({ openComp, onBackBtnClick }) {
    const { businessId } = useAppSystem();
    const { bizCodeName } = useClientAdmin();

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
                            bizId={businessId}
                            bizCodeName={bizCodeName}
                            isFromDash
                        />
                    </div>
                </Fragment>
            )}
        </section>
    );
}
