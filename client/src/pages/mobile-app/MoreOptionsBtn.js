import React, { useState, Fragment } from 'react';
import { logout } from '../../redux/actions/authActions';
import { Link, withRouter } from 'react-router-dom';
import { showComponent } from '../../redux/actions/componentActions';
import SpeedDialButton from '../../components/buttons/SpeedDialButton';
import { useStoreDispatch } from 'easy-peasy';
import ModalFullScreenHistory from "../dashboard-client-admin/dash-clients/clients-history/card-hidden-content/modal/modal-full-screen_history/ModalFullScreenHistory";
import PurchaseHistory from '../dashboard-client-admin/dash-clients/clients-history/card-hidden-content/modal-content-pages/PurchaseHistory';
import { useClientUser, useProfile } from '../../hooks/useRoleData';
import { CLIENT_URL } from '../../config/clientUrl';
import WhatsappBtn from '../../components/buttons/WhatsappBtn';
// SpeedDial and Icons
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import LocalMallIcon from '@material-ui/icons/LocalMall';
import ChatIcon from '@material-ui/icons/Chat';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Tooltip from './Tooltip';
import lStorage, { tooltip1, yellowBtn2, needSetTrueLocalKey } from '../../utils/storage/lStorage';
import ModalFullContent from '../../components/modals/ModalFullContent';
import Fab from '@material-ui/core/Fab';
// End SpeedDial and Icons

const lastOption = tooltip1;
const currOption = yellowBtn2;

const lastChecked = lStorage("getItem", lastOption);
const currChecked = lStorage("getItem", currOption);

function MoreOptionsBtn({
    history,
    playBeep,
    showMoreBtn,
    userName,
    needAppForCliAdmin,
    needAppForPreview,
    colorS, }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fullOpen, setFullOpen] = useState(false);

    const { _id } = useProfile();
    let { currScore, purchaseHistory, totalGeneralScore, totalPurchasePrize } = useClientUser();

    const dispatch = useStoreDispatch();

    const styles = {
        fabRoot: {
            bottom: '75px',
            right: '85px',
        },
        fabTooltip: {
            backgroundColor: "var(--mainYellow)",
            color: "var(--mainDark)",
            filter: `drop-shadow(0 0 15px #ffc)`,
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
                    title: `&#187; Histórico de Compras<br />${challengeN ? `de ${userName.slice(0, userName.indexOf(" "))}` : ""}`,
                    subTitle: null,
                    componentContent: <PurchaseHistory data={data} />,
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
                icon: <ExitToAppIcon />,
                name: 'Desconectar ►',
                backColor: "var(--themeSDark--" + colorS + ")",
                onClick: () => {
                    !needAppForPreview && logout(dispatch);
                    playBeep();
                }
            },
            {
                icon: <ChatIcon />,
                name: 'Fale Conosco ►', // Insert wahtsapp button and redirect user to it.
                backColor: "var(--themeSDark--" + colorS + ")",
                onClick: () => {
                    !needAppForPreview && setFullOpen(true);
                    playBeep();
                },
            },
            {
                icon: <LocalMallIcon />,
                name: 'Seu Histórico ►',
                backColor: "var(--themeSDark--" + colorS + ")",
                onClick: () => {
                    !needAppForPreview && setIsModalOpen(true);
                    playBeep();
                },
            }
        ]
    }

    return(
        <div className="position-relative">
            <div
                style={styles.fabRoot}
                className={`position-fixed ${!showMoreBtn  ? 'd-none' : 'd-block'}`}
            >
                <Tooltip
                    needOpen={needSetTrueLocalKey(lastChecked, currChecked)}
                    title={`♦ Sugestão: ${userName}, <br />adicione seus pontos facilmente<br/>clicando neste botão amarelo<br/>a cada nova compra. ▼`}
                    element={
                        <Fab
                            style={styles.fabTooltip}
                            className="float-it-5"
                            size="medium"
                            onClick={() => {
                                const path = needAppForCliAdmin ? "/cliente/pontos-fidelidade?client-admin=1" : "/cliente/pontos-fidelidade"
                                showComponent(dispatch, "purchaseValue");
                                history.push(path);
                                playBeep();
                                lStorage("setItem", currOption);
                            }}
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