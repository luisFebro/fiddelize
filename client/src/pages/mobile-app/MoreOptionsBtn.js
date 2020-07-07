import React, { useState, Fragment, useEffect } from 'react';
import { logout } from '../../redux/actions/authActions';
import { Link, withRouter } from 'react-router-dom';
import { showComponent } from '../../redux/actions/componentActions';
import SpeedDialButton from '../../components/buttons/SpeedDialButton';
import { useStoreDispatch } from 'easy-peasy';
import ModalFullScreenHistory from "../dashboard-client-admin/dash-clients/clients-history/card-hidden-content/modal/modal-full-screen_history/ModalFullScreenHistory";
import VAsyncPurchaseHistory from '../dashboard-client-admin/dash-clients/clients-history/card-hidden-content/modal-content-pages/VAsyncPurchaseHistory';
import { useClientUser, useProfile } from '../../hooks/useRoleData';
import { CLIENT_URL } from '../../config/clientUrl';
import WhatsappBtn from '../../components/buttons/WhatsappBtn';
import { readUser } from '../../redux/actions/userActions';
import { showSnackbar } from '../../redux/actions/snackbarActions';

// SpeedDial and Icons
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import LocalMallIcon from '@material-ui/icons/LocalMall';
import ChatIcon from '@material-ui/icons/Chat';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Tooltip from '../../components/tooltips/Tooltip';
import lStorage, { tooltip1, yellowBtn2, needSetTrueLocalKey } from '../../utils/storage/lStorage';
import ModalFullContent from '../../components/modals/ModalFullContent';
import Fab from '@material-ui/core/Fab';
import getFirstName from '../../utils/string/getFirstName';
// End SpeedDial and Icons

const lastOption = tooltip1;
const currOption = yellowBtn2;

const lastChecked = lStorage("getItem", lastOption);
const currChecked = lStorage("getItem", currOption);

const muStyle = {
    transform: 'scale(1.1)',
    filter:  'drop-shadow(.5px .5px 1.5px black)',
    color: '#fff',
}

function MoreOptionsBtn({
    history,
    animaClass,
    playBeep,
    showMoreBtn,
    userName,
    needAppForCliAdmin,
    needAppForPreview,
    colorS, }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [blockAccess, setBlockAccess] = useState(false);
    const [fullOpen, setFullOpen] = useState(false);

    const { _id } = useProfile();
    let { currScore, purchaseHistory, totalGeneralScore, totalPurchasePrize } = useClientUser();

    const dispatch = useStoreDispatch();

    useEffect(() => {
        let cancel;
        if(cancel) return;
        readUser(dispatch, _id, {select: "clientUserData.totalPurchasePrize"})
        .then(res => {
            //if user does not have the same quantity of prize in the db and thus not updateed
            //then, block access to loyalty score page to avoid registration of accumulative score from the last challenge.
            if(res.status !== 200) return console.log("smt wrong with readUser from morebtn")
            const totaldBPrizes = res.data.clientUserData.totalPurchasePrize;
            if(totaldBPrizes !== totalPurchasePrize) setBlockAccess(true);
        })
        return () => cancel = true;
    }, [_id, totalPurchasePrize])


    const styles = {
        fabRoot: {
            bottom: '75px',
            right: '85px',
        },
        fabTooltip: {
            backgroundColor: "var(--lightYellow)",
            color: "var(--mainDark)",
            filter: ``, // drop-shadow(0 0 8px #ffc)
        }
    }

    const showPurchaseHistoryModal = () => {
        const challengeN = !totalPurchasePrize ? 1 : totalPurchasePrize + 1;

        const data = {
            _id,
            name: userName,
            clientUserData: {
                purchaseHistory,
            },
            totalGeneralScore,
            totalPurchasePrize
        }
        return(
            <ModalFullScreenHistory
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                modalData={{
                    title: `&#187; Histórico de Compras<br />${challengeN ? `de ${getFirstName(userName)}` : ""}`,
                    subTitle: null,
                    componentContent: <VAsyncPurchaseHistory data={data} />,
                    challengeN: challengeN,
                    totalGeneralScore,
                    currUserScore: currScore,
                    userName: userName,
                }}
            />
        );
    }

    const speedDial = {
        actions: [
            //the order rendered is inverse from the bottom to top
            {
                icon: <ExitToAppIcon style={muStyle} />,
                name: 'Desconectar ►',
                backColor: "var(--themeSDark--" + colorS + ")",
                onClick: () => {
                    !needAppForPreview && logout(dispatch);
                }
            },
            {
                icon: <ChatIcon style={muStyle} />,
                name: 'Fale Conosco ►', // Insert wahtsapp button and redirect user to it.
                backColor: "var(--themeSDark--" + colorS + ")",
                onClick: () => {
                    !needAppForPreview && setFullOpen(true);
                    playBeep();
                },
            },
            {
                icon: <LocalMallIcon style={muStyle} />,
                name: 'Seu Histórico ►',
                backColor: "var(--themeSDark--" + colorS + ")",
                onClick: () => {
                    !needAppForPreview && setIsModalOpen(true);
                    playBeep();
                },
            }
        ]
    }

    const handleAddScoreClick = () => {
        if(blockAccess) return showSnackbar(dispatch, `${getFirstName(userName.cap())}, parece que sua pontuação está desatualizada. Verifique a notificação de confirmação para começar novo desafio ou reinicie o app.`, 9000)
        showComponent(dispatch, "purchaseValue");
        const path = needAppForCliAdmin ? "/cliente/pontos-fidelidade?client-admin=1" : "/cliente/pontos-fidelidade"
        history.push(path);
        playBeep();
        lStorage("setItem", currOption);
    }

    return(
        <div className="position-relative">
            <div
                style={styles.fabRoot}
                className={`position-fixed ${!showMoreBtn  ? 'd-none' : 'd-block'}`}
            >
                <Tooltip
                    needArrow
                    needOpen={needSetTrueLocalKey(lastChecked, currChecked)}
                    text={`♦ Sugestão: ${userName.cap()}, <br />adicione seus pontos facilmente<br/>clicando neste botão amarelo<br/>a cada nova compra.`}
                    backgroundColor={"var(--themeSDark--" + colorS + ")"}
                    element={
                        <Fab
                            style={styles.fabTooltip}
                            className="float-it-5"
                            size="medium"
                            onClick={handleAddScoreClick}
                        >
                            <LoyaltyIcon />
                        </Fab>
                    }
                />
            </div>
            <SpeedDialButton
                actions={speedDial.actions}
                onClick={playBeep}
                tooltipOpen={true}
                backColor={"var(--themeSDark--" + colorS + ")"}
                size="large"
                FabProps={{
                    backgroundColor: "var(--themeSDark--" + colorS + ")",
                    size: 'medium',
                    filter: `drop-shadow(.5px .5px 3px black)`, // still not working
                }}
                root={{
                    bottom: '30px',
                    right: '40px',
                }}
                hidden={!showMoreBtn}
            />
            {showPurchaseHistoryModal()}
            <ModalFullContent
                contentComp={<ContactComp />}
                fullOpen={fullOpen}
                setFullOpen={setFullOpen}
            />
        </div>
    );
}

export default withRouter(MoreOptionsBtn);

const ContactComp = () => {
    const showTitle = () => (
        <div className="my-4">
            <p
                className="text-subtitle text-purple text-center font-weight-bold"
            >
                &#187; Fale conosco
            </p>
        </div>
    );

    return(
        <Fragment>
            {showTitle()}
            <div className="mx-4">
                <img className="img-fluid" height="auto" src={`${CLIENT_URL}/img/illustrations/online-chat.svg`} alt="chat online"/>
            </div>
            <div style={{height: '100%'}} className="container-center">
                <WhatsappBtn />
            </div>
        </Fragment>
    );
};

/*ARCHIVES
// const { run, runName } = useStoreState(state => ({
//     run: state.globalReducer.cases.run,
//     runName: state.globalReducer.cases.runName,
// }))
// const needRun = run && runName === "appIntro";
*/