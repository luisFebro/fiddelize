import React, { useState } from 'react';
import ButtonFab from './material-ui/ButtonFab';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tooltip from '../tooltips/Tooltip';
import CloseButton from './CloseButton';
// a question instruction button for some functionalities explanations...
export default function InstructionBtn({
    text, onClick, needTooltip = true }) {
    const [closeBtn, setCloseBtn] = useState(false);
    const [needClose, setNeedClose] = useState(false);

    // WARNING: This causes performance issues with else condition, freezes the app
    // useEffect(() => {
    //     if(closeBtn) {
    //         document.body.style.setProperty('filter', `blur(1px)`)
    //     }
    // }, [closeBtn])

    return (
        <section>
            <div className={closeBtn && "blur-back"}></div>
            {needTooltip ? (
                <section
                    className="position-relative disable-blur"
                    onClick={() => { setCloseBtn(!closeBtn); }}
                >
                    <Tooltip
                        text={text}
                        padding="10px"
                        setCloseBtn={setCloseBtn}
                        whiteSpace
                        needArrow
                        needOpen={needClose ? false : true }
                        color="var(--mainWhite)"
                        backgroundColor="var(--mainDark)"
                        width={325}
                        element={
                            <div className="animated zoomIn delay-2s disable-blur">
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
                            delay={1}
                            position="absolute"
                            onClick={() => { setCloseBtn(false); setNeedClose(true); }}
                            top={-20}
                            right={-25}
                            size="1.4em"
                        />
                    )}
                </section>
            ) : (
                <ButtonFab
                    position="relative"
                    onClick={onClick}
                    color="var(--mainDark)"
                    backgroundColor="#CAD3C8" // light grey
                    iconFontAwesome={<FontAwesomeIcon icon="question-circle" className="d-flex align-items-center" style={{fontSize: 30}} />}
                    needIconShadow={false}
                />
            )}
        </section>
    );
}