import MoreVertIcon from "@material-ui/icons/MoreVert";
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";

export default function handleIcons(mainIcon, open) {
    if (open) return <CloseIcon className="main-options-icon" />;

    if (mainIcon === "hamburger") {
        return <MenuIcon className="main-options-icon" />;
    }

    if (mainIcon === "moreVert") {
        return <MoreVertIcon className="main-options-icon" />;
    }
}
