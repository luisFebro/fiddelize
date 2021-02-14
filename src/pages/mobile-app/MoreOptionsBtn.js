import { useState, Fragment, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { useStoreDispatch } from "easy-peasy";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoyaltyIcon from "@material-ui/icons/Loyalty";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import StarIcon from "@material-ui/icons/Star";
import ChatIcon from "@material-ui/icons/Chat";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Fab from "@material-ui/core/Fab";
import SpeedDialButton from "../../components/buttons/SpeedDialButton";
import { useClientUser, useProfile } from "../../hooks/useRoleData";
import { CLIENT_URL } from "../../config/clientUrl";
import WhatsappBtn from "../../components/buttons/WhatsappBtn";
import { readUser } from "../../redux/actions/userActions";
import { showSnackbar } from "../../redux/actions/snackbarActions";
// SpeedDial and Icons
import lStorage, { tooltip1, yellowBtn2 } from "../../utils/storage/lStorage";
import ModalFullContent from "../../components/modals/ModalFullContent";
import getFirstName from "../../utils/string/getFirstName";
import { Load } from "../../components/code-splitting/LoadableComp";
import { disconnect } from "../../hooks/useAuthUser";

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

const lastOption = tooltip1;
const currOption = yellowBtn2;

const lastChecked = lStorage("getItem", lastOption);
const currChecked = lStorage("getItem", currOption);

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
    animaClass,
    playBeep,
    showMoreBtn,
    userName,
    needAppForCliAdmin,
    needAppForPreview,
    colorS,
}) {
    const [blockAccess, setBlockAccess] = useState(false);
    const [purchaseModal, setPurchaseModal] = useState(false);
    const [contactModal, setContactModal] = useState(false);
    const [reviewModal, setReviewModal] = useState(false);

    const styles = getStyles();

    const { _id } = useProfile();
    const dispatch = useStoreDispatch();

    const {
        currScore,
        purchaseHistory,
        totalGeneralScore,
        totalPurchasePrize,
    } = useClientUser();

    useEffect(() => {
        let cancel;
        if (cancel) return;
        readUser(dispatch, _id, {
            select: "clientUserData.totalPurchasePrize",
            role: "cliente",
        }).then((res) => {
            // if user does not have the same quantity of prize in the db and thus not updateed
            // then, block access to loyalty score page to avoid registration of accumulative score from the last challenge.
            if (res.status !== 200)
                return console.log("smt wrong with readUser from morebtn");
            const totaldBPrizes =
                res.data.clientUserData &&
                res.data.clientUserData.totalPurchasePrize;
            if (totaldBPrizes !== totalPurchasePrize) setBlockAccess(true);
        });
        return () => (cancel = true);
    }, [_id, totalPurchasePrize]);

    const showPurchaseHistory = () => {
        const handlePurchaseClose = () => {
            setPurchaseModal(false);
        };

        const getModalData = () => ({
            cliUserName: userName,
            cliUserId: _id,
            currUserScore: currScore,
            totalGeneralScore,
            totalPurchasePrize,
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
                        await disconnect();
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

    const handleAddScoreClick = () => {
        if (blockAccess)
            return showSnackbar(
                dispatch,
                `${getFirstName(
                    userName.cap()
                )}, parece que sua pontuação está desatualizada. Verifique sua notificação de confirmação para começar novo desafio.`,
                9000
            );
        const path = needAppForCliAdmin
            ? "/cartao-virtual?client-admin=1"
            : "/cartao-virtual";
        history.push(path);
        playBeep();
        lStorage("setItem", currOption);
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
                    onClick={handleAddScoreClick}
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

const ContactComp = () => {
    const showTitle = () => (
        <div className="my-4">
            <p className="text-subtitle text-purple text-center font-weight-bold">
                &#187; Fale conosco
            </p>
        </div>
    );

    return (
        <Fragment>
            {showTitle()}
            <div className="mx-4">
                <img
                    className="img-fluid"
                    height="auto"
                    src={`${CLIENT_URL}/img/illustrations/online-chat.svg`}
                    alt="chat online"
                />
            </div>
            <div style={{ height: "100%" }} className="container-center">
                <WhatsappBtn />
            </div>
        </Fragment>
    );
};

/* ARCHIVES
<Tooltip
    needArrow
    needOpen={needSetTrueLocalKey(lastChecked, currChecked)}
    text={`♦ Sugestão: ${userName.cap()}, <br />adicione seus pontos facilmente<br/>clicando neste botão amarelo<br/>a cada nova compra.`}
    backgroundColor={"var(--themeSDark--" + colorS + ")"}
    element={

    }
/>

// const { run, runName } = useStoreState(state => ({
//     run: state.globalReducer.cases.run,
//     runName: state.globalReducer.cases.runName,
// }))
// const needRun = run && runName === "appIntro";
*/
