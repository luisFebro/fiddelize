import { useState, Fragment } from "react";
import { withRouter } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoyaltyIcon from "@material-ui/icons/Loyalty";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import StarIcon from "@material-ui/icons/Star";
import ChatIcon from "@material-ui/icons/Chat";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Fab from "@material-ui/core/Fab";
import SpeedDialButton from "components/buttons/SpeedDialButton";
import useData from "init";
import disconnect from "init/disconnect";
import { CLIENT_URL } from "config/clientUrl";
import WhatsappBtn from "components/buttons/WhatsappBtn";
// SpeedDial and Icons
import ModalFullContent from "components/modals/ModalFullContent";
import { Load } from "components/code-splitting/LoadableComp";
// import lStorage from "../../utils/storage/lStorage";

const AsyncHistory = Load({
    loader: () =>
        import(
            "./history-purchase-btn/AsyncPurchaseHistory" /* webpackChunkName: "cli-purchase-history-full-page-lazy" */
        ),
});

const AsyncReview = Load({
    loader: () =>
        import(
            "./modals/ReviewModal" /* webpackChunkName: "client-review-full-page-lazy" */
        ),
});

const getStyles = () => ({
    muStyle: {
        transform: "scale(1.1)",
        filter: "drop-shadow(.5px .5px 1.5px black)",
        color: "#fff",
    },
    fabRoot: {
        bottom: "75px",
        right: "85px",
    },
    fabTooltip: {
        backgroundColor: "var(--lightYellow)",
        color: "var(--mainDark)",
        filter: "", // drop-shadow(0 0 8px #ffc)
    },
});

function MoreOptionsBtn({
    history,
    playBeep,
    showMoreBtn,
    userName,
    needAppForCliAdmin,
    needAppForPreview,
    colorS,
    // animaClass,
}) {
    const [purchaseModal, setPurchaseModal] = useState(false);
    const [contactModal, setContactModal] = useState(false);
    const [reviewModal, setReviewModal] = useState(false);

    const styles = getStyles();

    const {
        _id,
        currPoints,
        totalGeneralPoints,
        currChall,
        // purchaseHistory,
    } = useData();

    const showPurchaseHistory = () => {
        const handlePurchaseClose = () => {
            setPurchaseModal(false);
        };

        const getModalData = () => ({
            cliUserName: userName,
            cliUserId: _id,
            currUserScore: currPoints,
            totalGeneralPoints,
            currChall,
        });

        const modalData = getModalData();
        const AsyncPurchaseHistory = <AsyncHistory modalData={modalData} />;

        return (
            <ModalFullContent
                contentComp={AsyncPurchaseHistory}
                fullOpen={purchaseModal}
                setFullOpen={handlePurchaseClose}
            />
        );
    };

    const speedDial = {
        actions: [
            // the order rendered is inverse from the bottom to top
            {
                icon: <ExitToAppIcon style={styles.muStyle} />,
                name: "Sair ►",
                backColor: `var(--themeSDark--${colorS})`,
                onClick: () => {
                    if (needAppForPreview) return;
                    (async () => {
                        await disconnect({ msg: true });
                    })();
                },
            },
            {
                icon: (
                    <FontAwesomeIcon
                        icon="sync-alt"
                        style={{ ...styles.muStyle, transform: "scale(1.3)" }}
                    />
                ),
                name: "Trocar App ►",
                backColor: `var(--themeSDark--${colorS})`,
                onClick: () => {
                    !needAppForPreview && history.push("/painel-de-apps");
                },
            },
            {
                icon: <ChatIcon style={styles.muStyle} />,
                name: "Fale Conosco ►", // Insert wahtsapp button and redirect user to it.
                backColor: `var(--themeSDark--${colorS})`,
                onClick: () => {
                    !needAppForPreview && setContactModal(true);
                    playBeep();
                },
            },
            {
                icon: <StarIcon style={styles.muStyle} />,
                name: "Sua Avaliação ►",
                backColor: `var(--themeSDark--${colorS})`,
                onClick: () => {
                    !needAppForPreview && setReviewModal(true);
                    playBeep();
                },
            },
            {
                icon: <LocalMallIcon style={styles.muStyle} />,
                name: "Seu Histórico ►",
                backColor: `var(--themeSDark--${colorS})`,
                onClick: () => {
                    !needAppForPreview && setPurchaseModal(true);
                    playBeep();
                },
            },
        ],
    };

    const handleOpenVirtualCard = () => {
        const path = needAppForCliAdmin
            ? "/cartao-virtual?client-admin=1"
            : "/cartao-virtual";
        history.push(path);
        playBeep();
        // lStorage("setItem", currOption);
    };

    const showContactComp = () => {
        const Comp = <ContactComp />;
        return (
            <ModalFullContent
                contentComp={Comp}
                fullOpen={contactModal}
                setFullOpen={setContactModal}
            />
        );
    };

    const showReviewComp = () => {
        const Comp = <AsyncReview />;
        return (
            <ModalFullContent
                contentComp={Comp}
                fullOpen={reviewModal}
                setFullOpen={setReviewModal}
            />
        );
    };

    return (
        <div className="position-relative">
            <div
                style={styles.fabRoot}
                className={`position-fixed ${
                    !showMoreBtn ? "d-none" : "d-block"
                }`}
            >
                <Fab
                    style={styles.fabTooltip}
                    className="floatdsa-it-5"
                    size="medium"
                    onClick={handleOpenVirtualCard}
                >
                    <LoyaltyIcon />
                </Fab>
            </div>
            <SpeedDialButton
                actions={speedDial.actions}
                onClick={playBeep}
                tooltipOpen
                backColor={`var(--themeSDark--${colorS})`}
                size="large"
                FabProps={{
                    backgroundColor: `var(--themeSDark--${colorS})`,
                    size: "medium",
                    filter: "drop-shadow(.5px .5px 3px black)", // still not working
                }}
                root={{
                    bottom: "30px",
                    right: "40px",
                }}
                hidden={!showMoreBtn}
            />
            {purchaseModal && showPurchaseHistory()}
            {contactModal && showContactComp()}
            {reviewModal && showReviewComp()}
        </div>
    );
}

export default withRouter(MoreOptionsBtn);

const ContactComp = () => {};

/* ARCHIVES
const lastOption = tooltip1;
const currOption = yellowBtn2;

const lastChecked = lStorage("getItem", lastOption);
const currChecked = lStorage("getItem", currOption);

<Tooltip
    needArrow
    needOpen={needSetTrueLocalKey(lastChecked, currChecked)}
    text={`♦ Sugestão: ${userName.cap()}, <br />adicione seus pontos facilmente<br/>clicando neste botão amarelo<br/>a cada nova compra.`}
    backgroundColor={"var(--themeSDark--" + colorS + ")"}
    element={

    }
/>
*/
