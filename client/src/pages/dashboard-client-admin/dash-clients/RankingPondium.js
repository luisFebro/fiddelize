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

const appSystemCol = { collection: "appSystem"};
const appSystem = lStorage("getItems", appSystemCol);

export default function RankingPondium() {
    let highestScores = useStoreState(state => state.userReducer.cases.highestScores);
    console.log("highestScores", highestScores);
    const dispatch = useStoreDispatch();

    // Test
    // highestScores = [
    //     { name: "luis febro", clientUserData: { currScore: 200}},
    //     // { name: "fabiano amorin", clientUserData: { currScore: 100}},
    //     // { name: "fernanda costa", clientUserData: { currScore: 50}}
    // ]

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
                        className={`${css[id]} position-absolute animated zoomIn delay-5s text-main-container text-shadow-white`}
                    >
                        {user === `name${id + 1}`
                        ? (
                            <FontAwesomeIcon
                                icon="question"
                                style={{fontSize: '2.3em', color: 'var(--themeP)'}}
                            />
                        ) : (
                            <p className={id === 0 ? `bounce-repeat animated bounce delay-3s` : ""}>
                                <span className="text-normal">
                                    {truncateWords(name.cap(), 10)}
                                </span>
                                <br />
                                <span className="text-subtitle">
                                    {clientUserData && convertDotToComma(clientUserData.currScore)}
                                    {id === 0 && " Pontos"}
                                </span>
                            </p>
                        )
                        }
                    </div>
                );
            })}
        </Fragment>
    );

    const gotFirstPlaceScore = highestScores && highestScores[0].clientUserData;

    return (
        <DivPodium
            className="animated zoomIn delay-5s my-3 container-center flex-column"
        >
            <Title
                title="&#187; Pódio Fidelidade"
                color="var(--themeP)"
                margin="my-4"
            />
            {!gotFirstPlaceScore && (
                <p className="text-normal mb-5" style={{color: 'grey'}}>
                    Aqui você acompanha as
                    <br />3 maiores pontuações
                    <br />de todos seus clientes com atualizações em tempo real.
                </p>
            )}
            <div className="position-relative">
                <img
                    className="shadow-elevation-black"
                    src={`${CLIENT_URL}/img/icons/podium.svg`}
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
        animation-iteration-count: 6;
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
        top: -5%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    & .second-place {
        top: 17%;
        left: 17%;
        transform: translate(-50%, -50%);
    }

    & .third-place {
        top: 25%;
        left: 80%;
        transform: translate(-50%, -50%);
    }
`;