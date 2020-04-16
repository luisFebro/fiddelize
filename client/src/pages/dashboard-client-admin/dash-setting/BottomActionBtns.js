import React, { Fragment, useState } from 'react';
import ButtonFab, { faStyleSmall } from '../../../components/buttons/material-ui/ButtonFab';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import getFirstName from '../../../utils/string/getFirstName';
import { CLIENT_URL } from '../../../config/clientUrl';
import WhatsappBtn from '../../../components/buttons/WhatsappBtn';
import ModalFullContent from '../../../components/modals/ModalFullContent';
import { useProfile, useCentralAdmin } from '../../../hooks/useRoleData';
import AOS from 'aos';

export default function BottomActionBtns() {
    const { name } = useProfile();

    const [fullOpen, setFullClose] = useState(false);

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
                    onClick={() => setFullClose(!fullOpen)}
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
                    title={`Turbine seu app, ${name && getFirstName(name)}`}
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
            <ModalFullContent
                contentComp={<ContactComp />}
                fullOpen={fullOpen}
                setFullClose={setFullClose}
            />
        </section>
    );
}

const ContactComp = () => {
    const { mainSalesWhatsapp, mainTechWhatsapp } = useCentralAdmin();

    const showTitle = () => (
        <div className="my-4">
            <p
                className="text-subtitle text-purple text-center font-weight-bold"
            >
                &#187; Fale conosco
            </p>
        </div>
    );
    // insert:
    // geralmente respondemos logo,
    // mas fico ciente de que o <strong>tempo
    // de resposta</strong> pode levar até 48 horas.
    return(
        <Fragment>
            {showTitle()}
            <div className="mx-4">
                <img className="img-fluid" height="auto" src={`${CLIENT_URL}/img/illustrations/online-chat.svg`} alt="chat online"/>
            </div>
            <section style={{height: '100%'}} className="container-center">
                <div className="container-center">
                    <WhatsappBtn iconName="chart-pie" elsePhone={mainSalesWhatsapp} supportName="Fabiano" />
                </div>
                <div className="container-center ml-4">
                    <WhatsappBtn iconName="cogs" elsePhone={mainTechWhatsapp} supportName="Luis" />
                </div>
            </section>
        </Fragment>
    );
};
