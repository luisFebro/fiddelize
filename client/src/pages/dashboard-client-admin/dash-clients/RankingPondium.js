import React, { useEffect, Fragment } from 'react';
import { useStoreState, useStoreDispatch } from 'easy-peasy';
import { CLIENT_URL } from '../../../config/clientUrl';
import Title from '../../../components/Title';
import truncateWords from '../../../utils/string/truncateWords';
import styled from 'styled-components';
import { readHighestScores } from '../../../redux/actions/userActions';
import { convertDotToComma } from '../../../utils/numbers/convertDotComma';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import lStorage from '../../../utils/storage/lStorage';
import  { appSystem } from '../../../hooks/useRoleData';

export default function RankingPondium() {
    let highestScores = useStoreState(state => state.userReducer.cases.highestScores);
    console.log("highestScores", highestScores);
    const dispatch = useStoreDispatch();

    useEffect(() => {
        const bizId = appSystem && appSystem.businessId;
        readHighestScores(dispatch, bizId);
    }, [])

    const showScores = () => (
        <Fragment>
            {highestScores && highestScores.length !== 0 && highestScores.map((user, id) => {
                const { name, clientUserData } = user;
                const css = ["first-place", "second-place", "third-place"];
                return(
                    <div
                        key={id}
                        className={`${css[id]} text-purple position-absolute animated zoomIn delay-5s`}
                    >
                        {name === `nome${id + 1}`
                        ? (
                            <FontAwesomeIcon
                                icon="question"
                                style={{fontSize: '2.3em', color: 'var(--themeP)'}}
                            />
                        ) : (
                            <p className={id === 0 ? `bounce-repeat animated bounce delay-3s` : ""}>
                                <span className="text-normal font-weight-bold text-shadow-white">
                                    {truncateWords(name.cap(), 10)}
                                </span>
                                <br />
                                <span className="text-subtitle font-weight-bold text-shadow-white">
                                    {clientUserData && convertDotToComma(clientUserData.currScore)}
                                    {id === 0 && " Pontos"}
                                </span>
                            </p>
                        )}
                    </div>
                );
            })}
        </Fragment>
    );

    const gotAtLeastOne = highestScores && highestScores[0].name !== "nome1";

    return (
        <DivPodium
            className="animated zoomIn delay-5s my-3 container-center flex-column"
        >
            <Title
                title="&#187; Pódio Fidelidade"
                color="var(--themeP)"
                margin="my-4"
                padding=" "
            />
            {!gotAtLeastOne && (
                <p className="text-normal" style={{color: 'grey'}}>
                    Aqui você acompanha as
                    <br />3 maiores pontuações
                    <br />de todos seus clientes com atualizações em tempo real.
                </p>
            )}
            <div className="position-relative" style={{marginTop: '30px'}}>
                <img
                    className="shadow-elevation-black"
                    src={`${CLIENT_URL}/img/icons/podium.png`}
                    alt="podium"
                    width="300"
                />
                {showScores()}
            </div>
        </DivPodium>
    );
}

const DivPodium = styled.div`
    & {
        display: flex;
        justify-content: center;
    }

    & .bounce-repeat {
        animation-iteration-count: 4;
    }

    & .podium-title {
        font-weight: bold;
    }

    & .first-place,
      .second-place,
      .third-place {
        text-align: center;
        font-weight: bold;
        min-width: 200px;
    }

    & .first-place {
        top: -9%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    & .second-place {
        top: 18%;
        left: 17%;
        transform: translate(-50%, -50%);
    }

    & .third-place {
        top: 26%;
        left: 85%;
        transform: translate(-50%, -50%);
    }
`;