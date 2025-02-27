import { useBizData } from "init";
import PickLogo from "../../../new-app/self-service/pickers/PickLogo";

export default function ShowLogoComp({ isDigitalMenu = false }) {
    const { bizId, bizLinkName } = useBizData();

    return (
        <div
            className="animated zoomIn container-center text-purple text-hero"
            style={{ margin: "50px 0px 0px" }}
        >
            <PickLogo
                isDigitalMenu={isDigitalMenu}
                bizId={bizId}
                bizLinkName={bizLinkName}
                isFromDash
            />
        </div>
    );
}
