import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { Link } from "react-router-dom";
import ButtonFab from "components/buttons/material-ui/ButtonFab";

const addIconStyle = {
    transform: "scale(1.5)",
    color: "#fff",
    filter: "drop-shadow(.1px .1px .9px grey)",
};

export default function ProBtn({ type = "link", linkTitle }) {
    const AddCircleIcon = <AddCircleOutlineIcon style={addIconStyle} />;
    const to = "/planos?cliente-admin=1&store=1";

    if (type === "link") {
        return (
            <Link to={to} className="text-link">
                {linkTitle}
            </Link>
        );
    }

    if (type === "creditBtn") {
        return (
            <Link to={to} className="no-text-decoration">
                <ButtonFab
                    position="relative"
                    onClick={null}
                    iconMu={AddCircleIcon}
                    size="medium"
                    color="white"
                    backgroundColor="var(--themeSDark--default)"
                />
            </Link>
        );
    }

    return <div />;
}

/* ARCHIVES

const handlePickedComp = () => {
    const PickedComp = pickPackageService({ service, data: modalData });
    return <PickedComp />;
};

const PickedComponent = handlePickedComp();

 */
