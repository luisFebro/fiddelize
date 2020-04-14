import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Card from '@material-ui/core/Card';
import ButtonFab from '../../../../../../components/buttons/material-ui/ButtonFab';
import { useClientAdmin } from '../../../../../../hooks/useRoleData';

const faStyle = {
    filter: 'drop-shadow(0 0 30px #ffc)',
    color: '#ff0',
    fontSize: '30px',
}

export default function PrizeCard({ historyData }) {
    const [prizeView, setPrizeView] = useState(false);

    const currChallengeN = historyData.challengeN;

    const { mainReward, rewardList } = useClientAdmin();

    const handlePrizeName = (currChallengeN) => {
        if(currChallengeN === 1) {
            return mainReward;
        } else {
            const ind = currChallengeN - 2 // start with 0 in the rewardList and so on...
            return rewardList[ind];
        }
    }

    const displayMainContent = () => (
        <section className="purchase-history-prize-card--root text-shadow text-white text-center text-purple">
            <main className="gift-main-title" >
                <div>
                    <FontAwesomeIcon icon="gift" style={{...faStyle, fontSize: '45px', filter: ''}} />
                    <p className="edition font-weight-bold text-subtitle">
                        #{historyData.challengeN}
                    </p>
                </div>
                <div>
                    <p className="text-title">Você ganhou:</p>
                    <div className="font-weight-bold text-normal">
                        {!prizeView
                        ? (
                            <div className="prize-btn">
                                 <ButtonFab
                                    position="relative"
                                    onClick={() => setPrizeView(true)}
                                    title="Ver seu Prêmio"
                                    variant="extended"
                                    color="white"
                                    backgroundColor="var(--themeSDark)"
                                />
                            </div>
                        ) : (
                            <p className="text-normal animated zoomIn fast">
                                • {handlePrizeName(currChallengeN)}
                            </p>
                        )}
                    </div>
                </div>
            </main>
        </section>
    );

    // Test
    const isPrizeConfirmed = false;
    const isPrizeReceived = false;

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
                        <div className="icon animated rubberBand delay-5s" style={{animationIterationCount: 3}}>
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
                        <div className="icon animated rubberBand delay-5s" style={{animationIterationCount: 3}}>
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
        <section className="position-relative animated slideInDown fast">
            <Card key={historyData.desc} className="mt-4" style={{backgroundColor: 'var(--themePLight)'}}>
                {displayMainContent()}
            </Card>
            {showStatusPanel()}
        </section>
    );
}