import React from 'react';
import ButtonFab, { faStyleSmall } from '../../../components/buttons/material-ui/ButtonFab';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useStoreState } from 'easy-peasy';
import getFirstName from '../../../utils/string/getFirstName';
import AOS from 'aos';

export default function BottomActionBtns() {
    const { userName } = useStoreState(state => ({
        userName: state.userReducer.cases.currentUser.name,
    }));

    AOS.init({
        offset: 50,
    });

    return (
        <section className="bottom-action-btns--root">
            <div className="talk-btn" data-aos="flip-left">
                <ButtonFab
                    position="relative"  // SUGGESTIONS, TECHNICAL SUPPORT
                    variant="extended"
                    title="Fale conosco"
                    size="medium"
                    onClick={null}
                    color="white"
                    backgroundColor="var(--mainCyan)"
                    iconFontAwesome={<FontAwesomeIcon icon="comment" style={faStyleSmall} />}
                />
            </div>
            <div className="premium-btn" data-aos="flip-up">
                <ButtonFab
                    position="relative"
                    variant="extended"
                    textTransform="none"
                    title={`Turbine seu app, ${getFirstName(userName.cap())}`}
                    size="large"
                    onClick={null}
                    color="var(--mainWhite)"
                    backgroundColor="var(--niceUiYellow)"
                    iconFontAwesome={<FontAwesomeIcon
                                        className="animated rubberBand delay-5s"
                                        icon="crown"
                                        style={{...faStyleSmall, animationIterationCount: 4 }} />}
                />
            </div>
        </section>
    );
}