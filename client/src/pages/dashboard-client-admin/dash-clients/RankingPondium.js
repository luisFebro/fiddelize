import React, { Fragment } from 'react';
import Title from '../../../components/Title';
import truncateWords from '../../../utils/string/truncateWords';
import styled from 'styled-components';
import { convertDotToComma } from '../../../utils/numbers/convertDotComma';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import  { useAppSystem } from '../../../hooks/useRoleData';
import Img from '../../../components/Img';
import useAPIList, { readHighestScores } from '../../../hooks/api/useAPIList';

export default function RankingPondium() {
    const { businessId } = useAppSystem();

    const {
        list,
        gotListItems = true,
    } =  useAPIList({
        url: readHighestScores(businessId),
        needAuth: false,
        listName: "rankingPodium",
    })
    const highestScores = [{name: "febro feitoza", score: 1200}, {name: "fernanda lima", score: 500}]
    console.log("gotListItems", gotListItems);
    console.log("highestScores", highestScores);

    const showScores = () => (
        <Fragment>
            {gotListItems && [0, 1, 2].map(ind => {
                const css = ["first-place", "second-place", "third-place"];
                const itemsList = highestScores[ind];

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
                                    {convertDotToComma(itemsList.score)}
                                    {ind === 0 && " Pontos"}
                                </span>
                                <br />
                                <span className="text-normal font-weight-bold text-shadow-white">
                                    {truncateWords(itemsList.name.cap(), 10)}
                                </span>
                            </p>
                        )}
                    </div>
                );
            })}
        </Fragment>
    );

    const gotAtLeastOne = highestScores && highestScores[0];

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
            {!gotAtLeastOne && (
                <p className="text-normal" style={{color: 'grey'}}>
                    Aqui você acompanha as
                    <br />3 maiores pontuações
                    <br />de todos seus clientes com atualizações em tempo real.
                </p>
            )}
            <div className="position-relative" style={{marginTop: '30px'}}>
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
        </DivPodium>
    );
}

const DivPodium = styled.div`
    & {
        display: flex;
        justify-content: center;
    }

    & .bounce-repeat {
        animation-iteration-count: 5;
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