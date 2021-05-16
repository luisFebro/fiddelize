import PropTypes from "prop-types";
import useRun from "global-data/ui";
import Dialog from "@material-ui/core/Dialog";
import CloseButton from "../buttons/CloseButton";
import RadiusBtn from "../buttons/RadiusBtn";
import ButtonMulti from "../buttons/material-ui/ButtonMulti";

ModalFullContent.propTypes = {
    contentComp: PropTypes.node,
    setFullOpen: PropTypes.func,
    style: PropTypes.object,
};

const getStyles = ({ needIndex }) => ({
    // assign as false when you need to open other modals above this component like calendar dialog
    root: {
        zIndex: needIndex ? 3000 : 15,
        overflowX: "hidden",
    },
});

export default function ModalFullContent({
    contentComp,
    fullOpen,
    setFullOpen,
    animatedClass,
    exitBtn,
    showBackBtn = false,
    needIndex = true,
    backgroundColor,
    // style,
}) {
    const { runName } = useRun();

    const styles = getStyles({ needIndex });

    const handleOpen = () => {
        if (runName === "closeModalFullContent") return false;
        return fullOpen;
    };

    const handleModalClose = () => {
        setFullOpen((prevStatus) => !prevStatus);
    };

    return (
        <Dialog
            PaperProps={{
                style: {
                    backgroundColor: backgroundColor || "var(--mainWhite)",
                    maxWidth: "500px",
                    overflowX: "hidden",
                },
            }}
            maxWidth="md"
            fullWidth
            style={styles.root}
            fullScreen
            open={handleOpen()}
            aria-labelledby="form-dialog-title"
            className={`${animatedClass || ""}`}
            onScroll={null}
        >
            {contentComp}
            {exitBtn === "text" ? (
                <RadiusBtn
                    position="fixed"
                    onClick={setFullOpen}
                    top={0}
                    right={15}
                    title="voltar"
                    backgroundColor="black"
                    size="extra-small"
                />
            ) : (
                <CloseButton
                    onClick={setFullOpen}
                    size="40px"
                    top="10px"
                    right="10px"
                />
            )}

            {showBackBtn && (
                <div className="my-4 container-center">
                    <ButtonMulti
                        title="Voltar"
                        color="var(--mainWhite)"
                        backgroundColor="var(--themeP)"
                        onClick={handleModalClose}
                    />
                </div>
            )}
        </Dialog>
    );
}
