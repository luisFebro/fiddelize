import { Fragment } from "react";
import BackButton from "../../../../../components/buttons/BackButton";
import PickRatingIcon from "../../../../new-app/self-service/pickers/PickRatingIcon";

export default function ShowIconComp({ openComp, onBackBtnClick }) {
    const showBackBtn = () => (
        <div className="d-flex justify-content-start">
            <BackButton title="Voltar Opções" onClick={onBackBtnClick} />
        </div>
    );

    return (
        <section>
            {openComp === "icon" && (
                <Fragment>
                    {showBackBtn()}
                    <div
                        className="animated zoomIn slow container-center text-purple text-hero"
                        style={{ margin: "50px 0px 110px" }}
                    >
                        <PickRatingIcon isFromDash />
                    </div>
                </Fragment>
            )}
        </section>
    );
}
