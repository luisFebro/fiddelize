import { Fragment } from "react";
import useRun from "global-data/ui";
import Dialog from "@material-ui/core/Dialog";
import CloseButton from "../buttons/CloseButton";
import RadiusBtn from "../buttons/RadiusBtn";
import ButtonMulti from "../buttons/material-ui/ButtonMulti";

const handleZIndex = (needIndex) => {
    if (typeof needIndex === "number") return needIndex;
    if (needIndex) return 3000;

    return 15;
};

const getStyles = ({ needIndex }) => ({
    // assign as false when you need to open other modals above this component like calendar dialog
    root: {
        zIndex: handleZIndex(needIndex),
        overflowX: "hidden",
    },
});

export default function ModalFullContent({
    contentComp,
    fullOpen,
    fullScreen = true,
    setFullOpen,
    animatedClass,
    exitBtn,
    showBackBtn = false,
    needIndex = true,
    backgroundColor,
    maxWidth = "500px",
    overflowY = undefined,
    needCloseBtn = true,
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
                    maxWidth,
                    overflowX: "hidden",
                    overflowY,
                },
            }}
            maxWidth="md"
            fullWidth
            style={styles.root}
            fullScreen={fullScreen}
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
                <Fragment>
                    {needCloseBtn && (
                        <CloseButton
                            onClick={setFullOpen}
                            size="40px"
                            top="10px"
                            right="10px"
                        />
                    )}
                </Fragment>
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
