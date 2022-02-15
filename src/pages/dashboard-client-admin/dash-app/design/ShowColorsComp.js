import PickTheming from "../../../new-app/self-service/pickers/PickTheming";

export default function ShowColorsComp() {
    return (
        <div
            className="animated zoomIn slow container-center text-purple"
            style={{ margin: "50px 0px 0px" }}
        >
            <PickTheming isFromDash />
        </div>
    );
}
