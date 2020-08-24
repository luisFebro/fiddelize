import React, { Fragment } from 'react';
import Title from '../../../components/Title';
import truncateWords from '../../../utils/string/truncateWords';
import styled from 'styled-components';
import convertToReal from '../../../utils/numbers/convertToReal';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import  { useAppSystem } from '../../../hooks/useRoleData';
import Img from '../../../components/Img';
import useAPI, { readHighestScores } from '../../../hooks/api/useAPI';

export default function RankingPondium() {
    const { businessId } = useAppSystem();

    const {
        data: highestScores,
        gotData,
        loading,
    } =  useAPI({
        url: readHighestScores(businessId),
        needAuth: false,
        dataName: "rankingPodium",
    })

    const showScores = () => (
        <Fragment>
            {gotData && [0, 1, 2].map(ind => {
                const css = ["first-place", "second-place", "third-place"];
                const itemsList = highestScores[ind];

                const clientScore = convertToReal(itemsList && itemsList.score);
                const clientName = truncateWords(itemsList && itemsList.name.cap(), 10);

                return(
                    <div
                        key={ind}
                        className={`${css[ind]} text-purple position-absolute animated zoomIn delay-5s`}
                    >
                        {!itemsList
                        ? (
                            <FontAwesomeIcon
                                icon="question"
                                style={{fontSize: '2.3em', color: 'var(--themeP)'}}
                            />
                         ) : (
                             <p className={ind === 0 ? `bounce-repeat animated bounce delay-3s` : ""}>
                                 <span style={{top: '14px'}} className="position-relative text-subtitle font-weight-bold text-shadow-white">
                                     {clientScore}
                                     {ind === 0 && " Pontos"}
                                 </span>
                                 <br />
                                 <span className="text-normal font-weight-bold text-shadow-white">
                                     {clientName}
                                 </span>
                             </p>
                         )}
                     </div>
                 );
            })}
        </Fragment>
    );

    return (
        <DivPodium
            className="animated zoomIn delay-1s my-3 container-center flex-column"
        >
            <Title
                title="&#187; Pódio Fidelidade"
                color="var(--themeP)"
                margin="my-5"
                padding=" "
            />
            {(!gotData && !loading) && (
                <p className="text-normal" style={{color: 'grey'}}>
                    Aqui você acompanha as
                    <br />3 maiores pontuações
                    <br />de todos seus clientes com atualizações em tempo real.
                </p>
            )}
            <div className="position-relative" style={{marginTop: '30px'}}>
                {(loading && !gotData) && (
                    <p className="text-purple font-weight-bold text-center text-normal">
                       carregando...
                    </p>
                )}
                <Img
                    className="shadow-elevation-black"
                    src="/img/icons/podium.png"
                    offline={true}
                    alt="pódio da fiddelize"
                    width={300}
                    height={250}
                />
                {showScores()}
            </div>
            <hr className="lazer-purple"/>
        </DivPodium>
    );
}

const DivPodium = styled.div`
    & {
        display: flex;
        justify-content: center;
    }

    & .bounce-repeat {
        animation-iteration-count: 2;
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
        top: -14%;
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