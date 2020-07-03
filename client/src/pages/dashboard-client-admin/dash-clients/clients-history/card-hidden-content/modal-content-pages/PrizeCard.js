import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Card from '@material-ui/core/Card';
import ButtonFab from '../../../../../../components/buttons/material-ui/ButtonFab';
import { useClientAdmin } from '../../../../../../hooks/useRoleData';
import selectTxtStyle from '../../../../../../utils/biz/selectTxtStyle';
import pickCurrChallData from '../../../../../../utils/biz/pickCurrChallData';

const faStyle = {
    filter: 'drop-shadow(0 0 25px grey)',
    color: '#ff0',
    fontSize: '30px',
}

export default function PrizeCard({ historyData, colorP, colorS }) {
    const [prizeView, setPrizeView] = useState(false);

    const currChallengeN = historyData.challengeN;
    const isPrizeConfirmed = historyData.isPrizeConfirmed;
    const isPrizeReceived = historyData.isPrizeReceived;

    let { mainReward, rewardList } = useClientAdmin();

    const pickedObj = pickCurrChallData(rewardList, currChallengeN - 1);
    mainReward = pickedObj["mainReward"]

    const displayMainContent = () => (
        <section className={`${selectTxtStyle(colorP)} purchase-history-prize-card--root text-center text-purple`}>
            <main className="gift-main-title" >
                <div>
                    <FontAwesomeIcon icon="trophy" style={{...faStyle, fontSize: '45px'}} />
                    <p
                        style={{zIndex: 100}}
                        className="edition font-weight-bold text-subtitle"
                    >
                        #{historyData.challengeN}
                    </p>
                </div>
                <div>
                    <p className="text-title">Você ganhou!</p>
                    <div className="font-weight-bold text-normal">
                        {!prizeView
                        ? (
                            <div className="prize-btn">
                                 <ButtonFab
                                    position="relative"
                                    onClick={() => setPrizeView(true)}
                                    title="Ver seu Prêmio"
                                    needTxtNoWrap={true}
                                    variant="extended"
                                    color="white"
                                    backgroundColor={"var(--themeSDark--" + colorS +  ")"}
                                />
                            </div>
                        ) : (
                            <p className="text-normal animated zoomIn fast">
                                • {mainReward}
                            </p>
                        )}
                    </div>
                </div>
            </main>
        </section>
    );

    const showStatusPanel = () => (
        <section className="card-elevation text-purple position-relative purchase-history-status-panel--root">
            <div className="board">
                <p
                    className="text-center text-small font-weight-bold text-white"
                    style={{margin: '10px 0 10px 10px', backgroundColor: "var(--mainDark)", borderRadius: '30% 30%', padding: '5px 8px'}}
                >
                    STATUS
                </p>
                <div className="confirmed-status text-small">
                    <p className="font-weight-bold">Confirmado:</p>
                    {isPrizeConfirmed
                    ? (
                        <div className="icon animated rubberBand delay-2s repeat-2">
                            <FontAwesomeIcon icon="check-circle" style={{color: 'green', fontSize: '20px'}} />
                        </div>
                    ) : (
                        <div className="icon">
                            <FontAwesomeIcon icon="times-circle" style={{color: 'grey', fontSize: '20px'}} />
                        </div>
                    )}
                </div>
                <div className="received-status text-small">
                    <p className="font-weight-bold">Recebido:</p>
                    {isPrizeReceived
                    ? (
                        <div className="icon animated rubberBand delay-4s repeat-2">
                            <FontAwesomeIcon icon="check-circle" style={{color: 'green', fontSize: '20px'}} />
                        </div>
                    ) : (
                        <div className="icon">
                            <FontAwesomeIcon icon="times-circle" style={{color: 'grey', fontSize: '20px'}} />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
    return(
        <section className="position-relative animated slideInUp fast">
            <Card
                key={historyData.desc}
                className="mt-2"
                style={{backgroundColor: 'var(--themePLight--' + colorP + ')'}}
            >
                {displayMainContent()}
            </Card>
            {showStatusPanel()}
        </section>
    );
}