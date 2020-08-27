import React, { useState } from 'react';
import ButtonFab from './material-ui/ButtonFab';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tooltip from '../tooltips/Tooltip';
import CloseButton from './CloseButton';
import PropTypes from 'prop-types';
import ModalFullContent from '../../components/modals/ModalFullContent';
import pickArticle from '../../pages/articles/pickArticle';

InstructionBtn.propTypes = {
    mode: PropTypes.oneOf(["none", "tooltip", "modal"]),
}

// a question instruction button for some functionalities explanations...
export default function InstructionBtn({
    text,
    onClick,
    mode = "none",
    blurEffect = false,
    article = "SomeArticle_art1",
}) {
    const [closeBtn, setShowCloseBtn] = useState(false);
    const [needOpen, setNeedOpen] = useState(false);

    const [fullOpen, setFullOpen] = useState(false);

    const handleFullOpen = () => {
        setFullOpen(true);
    }

    const handlePickedComp = () => {
        const PickedComp = pickArticle({ article });
        return(<PickedComp />)
    }

    const PickedArticle = handlePickedComp();

    const DefaultIcon =
    <FontAwesomeIcon icon="question-circle" className="d-flex align-items-center" style={{fontSize: 30}} />

    const TooltipBtn = // LESSON: Do not fucking pass a React Element without a html wrapper such as DIV cuz it is gives ref errors...
    <div className="animated zoomIn delay-2s disable-blur">
        <ButtonFab
            position="relative"
            color="var(--themePLight)"
            backgroundColor="var(--mainWhite)"
            iconFontAwesome={<FontAwesomeIcon icon="info-circle" className="d-flex align-items-center" style={{fontSize: 30}} />}
            needIconShadow={false}
        />
    </div>

    return (
        <section>
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
                <section
                    className="position-relative disable-blur"
                    onClick={null}
                >
                    <Tooltip
                        text={text}
                        hover={true}
                        onClickAway={null}
                        padding="10px"
                        arrowBottom="4px !important"
                        whiteSpace
                        needArrow
                        needOpen={needOpen ? true : false }
                        color="var(--mainWhite)"
                        backgroundColor="var(--mainDark)"
                        width={325}
                        element={TooltipBtn}
                    />
                    {false && (
                        <CloseButton
                            delay={0}
                            color='var(--mainDark)'
                            position="absolute"
                            onClick={() => { setNeedOpen(false); }}
                            top={-20}
                            right={-25}
                            size="1.4em"
                        />
                    )}
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
                        showBackBtn={true}
                    />
                </section>
            )}
        </section>
    );
}

/*
<div className={(closeBtn && blurEffect) ? "blur-back" : undefined}></div>
 */