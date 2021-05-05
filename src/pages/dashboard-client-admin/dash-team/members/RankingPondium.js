import { Fragment } from "react";
import styled from "styled-components";
import useAPI, { getMembersPodium } from "api/useAPI";
// import convertToReal from "utils/numbers/convertToReal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import truncateWords from "utils/string/truncateWords";
import { useBizData } from "init";
import Img from "components/Img";

export default function RankingPondium() {
    const { bizId } = useBizData();

    const { data: highestData, gotData, loading } = useAPI({
        url: getMembersPodium(bizId),
        needAuth: false,
        dataName: "membersPodium",
    });

    const showScores = () => (
        <Fragment>
            {[0, 1, 2].map((ind) => {
                const css = ["first-place", "second-place", "third-place"];
                const itemsList = gotData && highestData[ind];

                const registerTotal = itemsList && itemsList.value;
                const memberName = truncateWords(
                    itemsList && itemsList.name.cap(),
                    13
                );

                return (
                    <div
                        key={ind}
                        className={`${css[ind]} text-purple position-absolute animated zoomIn delay-2s`}
                    >
                        {!itemsList ? (
                            <FontAwesomeIcon
                                icon="question"
                                style={{
                                    fontSize: "2.3em",
                                    color: "var(--themeP)",
                                }}
                            />
                        ) : (
                            <p
                                className={
                                    ind === 0
                                        ? "bounce-repeat animated bounce delay-3s"
                                        : ""
                                }
                            >
                                <span
                                    style={{ top: "14px" }}
                                    className="text-nowrap position-relative text-subtitle font-weight-bold text-shadow-white"
                                >
                                    {registerTotal}{" "}
                                    {Boolean(ind === 0) && "Cadastros"}
                                </span>
                                <br />
                                <span className="d-inline-block mt-2 text-normal font-weight-bold text-shadow-white">
                                    {memberName}
                                </span>
                            </p>
                        )}
                    </div>
                );
            })}
        </Fragment>
    );

    return (
        <DivPodium className="animated fadeIn my-3 container-center flex-column">
            <div className="position-relative" style={{ marginTop: "30px" }}>
                <Img
                    className="shadow-elevation-black"
                    src="/img/icons/podium.png"
                    offline
                    alt="pódio da fiddelize"
                    width={300}
                    height={250}
                />
                {showScores()}
            </div>
            <hr className="lazer-purple" />
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
