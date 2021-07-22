import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonFab from "./material-ui/ButtonFab";
import Tooltip from "../tooltips/Tooltip";
// import CloseButton from "./CloseButton";
import ModalFullContent from "../modals/ModalFullContent";
import pickArticle from "../../pages/articles/pickArticle";

// a question instruction button for some functionalities explanations...
export default function InstructionBtn({
    text,
    onClick,
    mode = "none", // "none", "tooltip", "modal"
    article,
    animated = false,
    tooltipProps,
    // blurEffect = false,
}) {
    const [needOpen, setNeedOpen] = useState(false);
    const [fullOpen, setFullOpen] = useState(false);

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const handlePickedComp = () => {
        const PickedComp = pickArticle({ article });
        return <PickedComp />;
    };

    const PickedArticle = handlePickedComp();

    const DefaultIcon = (
        <FontAwesomeIcon
            icon={article ? "exclamation-circle" : "question-circle"}
            className="d-flex align-items-center"
            style={{ fontSize: 30 }}
        />
    );

    const TooltipBtn = ( // LESSON: Do not fucking pass a React Element without a html wrapper such as DIV cuz it is gives ref errors...
        <div
            className={`${
                animated ? "animated zoomIn delay-2s" : ""
            } disable-blur`}
        >
            <ButtonFab
                position="relative"
                color="var(--themePLight)"
                backgroundColor="var(--mainWhite)"
                iconFontAwesome={
                    <FontAwesomeIcon
                        icon="info-circle"
                        className="d-flex align-items-center"
                        style={{ fontSize: 30 }}
                    />
                }
                needIconShadow={false}
            />
        </div>
    );

    return (
        <section
            style={{
                position: "relative",
                zIndex: 100,
            }}
        >
            {mode === "none" && (
                <section>
                    <ButtonFab
                        position="relative"
                        onClick={onClick}
                        color="var(--mainDark)"
                        backgroundColor="#CAD3C8" // light grey
                        iconFontAwesome={DefaultIcon}
                        needIconShadow={false}
                    />
                </section>
            )}

            {mode === "tooltip" && (
                <section onClick={null}>
                    <Tooltip
                        text={text}
                        hover
                        onClickAway={null}
                        padding="10px"
                        arrowBottom="4px !important"
                        whiteSpace
                        width={325}
                        needArrow
                        needOpen={!!needOpen}
                        color="var(--mainWhite)"
                        backgroundColor="var(--mainDark)"
                        element={TooltipBtn}
                        {...tooltipProps}
                    />
                </section>
            )}

            {mode === "modal" && (
                <section>
                    <ButtonFab
                        position="relative"
                        onClick={handleFullOpen}
                        color="var(--themePLight)"
                        backgroundColor="var(--mainWhite)" // light grey
                        iconFontAwesome={DefaultIcon}
                        needIconShadow={false}
                    />
                    <ModalFullContent
                        contentComp={PickedArticle}
                        fullOpen={fullOpen}
                        setFullOpen={setFullOpen}
                        showBackBtn
                    />
                </section>
            )}
        </section>
    );
}

/* ARCHIVES
<div className={(closeBtn && blurEffect) ? "blur-back" : undefined}></div>

{false && (
    <CloseButton
        delay={0}
        color="var(--mainDark)"
        position="absolute"
        onClick={() => {
            setNeedOpen(false);
        }}
        top={-20}
        right={-25}
        size="1.4em"
    />
)}
 */
