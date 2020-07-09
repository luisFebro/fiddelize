import React, { useState } from 'react';
import ButtonFab from './material-ui/ButtonFab';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tooltip from '../tooltips/Tooltip';
import CloseButton from './CloseButton';
// a question instruction button for some functionalities explanations...
export default function InstructionBtn({
    text, onClick, needTooltip = true, blurEffect = false, }) {
    const [closeBtn, setShowCloseBtn] = useState(false);
    const [needOpen, setNeedOpen] = useState(false);

    // WARNING: This causes performance issues with else condition, freezes the app
    // useEffect(() => {
    //     if(closeBtn) {
    //         document.body.style.setProperty('filter', `blur(1px)`)
    //     }
    // }, [closeBtn])

    return (
        <section>
            <div className={(closeBtn && blurEffect) ? "blur-back" : undefined}></div>
            {needTooltip ? (
                <section
                    className="position-relative disable-blur"
                    onClick={() => setShowCloseBtn(true)}
                >
                    <Tooltip
                        text={text}
                        onClickAway={() => setShowCloseBtn(false)}
                        padding="10px"
                        whiteSpace
                        needArrow
                        needOpen={needOpen ? true : false }
                        color="var(--mainWhite)"
                        backgroundColor="var(--mainDark)"
                        width={325}
                        element={
                            <div className="disable-blur">
                                <ButtonFab
                                    position="relative"
                                    color="var(--mainDark)"
                                    backgroundColor="#CAD3C8" // light grey
                                    iconFontAwesome={<FontAwesomeIcon icon="question-circle" className="d-flex align-items-center" style={{fontSize: 30}} />}
                                    needIconShadow={false}
                                />
                            </div>
                        }
                    />
                    {closeBtn && (
                        <CloseButton
                            delay={0}
                            color='var(--mainDark)'
                            position="absolute"
                            onClick={() => { setShowCloseBtn(false); setNeedOpen(false); }}
                            top={-20}
                            right={-25}
                            size="1.4em"
                        />
                    )}
                </section>
            ) : (
                <ButtonFab
                    position="relative"
                    onClick={() => onClick()}
                    color="var(--mainDark)"
                    backgroundColor="#CAD3C8" // light grey
                    iconFontAwesome={<FontAwesomeIcon icon="question-circle" className="d-flex align-items-center" style={{fontSize: 30}} />}
                    needIconShadow={false}
                />
            )}
        </section>
    );
}