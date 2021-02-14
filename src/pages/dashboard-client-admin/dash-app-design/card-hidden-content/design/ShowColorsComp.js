import { Fragment } from "react";
import PickTheming from "../../../../new-app/self-service/pickers/PickTheming";
import BackButton from "../../../../../components/buttons/BackButton";

export default function ShowColorsComp({ openComp, onBackBtnClick }) {
    const showBackBtn = () => (
        <div className="d-flex justify-content-start">
            <BackButton title="Voltar Opções" onClick={onBackBtnClick} />
        </div>
    );

    return (
        <section>
            {openComp === "colors" && (
                <Fragment>
                    {showBackBtn()}
                    <div
                        className="animated zoomIn slow container-center text-purple"
                        style={{ margin: "50px 0px 0px" }}
                    >
                        <PickTheming isFromDash />
                    </div>
                </Fragment>
            )}
        </section>
    );
}
