import { Fragment, useState } from "react";
import useAPI, { getMembersPodium } from "api/useAPI";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import truncateWords from "utils/string/truncateWords";
import { useBizData } from "init";
import Img from "components/Img";
import SwitchBtn from "components/buttons/material-ui/SwitchBtn";

export default function RankingPondium() {
    const [type, setType] = useState("true");
    const { bizId } = useBizData();

    const isRegister = type.includes("true");

    const { data: highestData, gotData } = useAPI({
        url: getMembersPodium(bizId),
        needAuth: false,
        dataName: "membersPodium",
        params: {
            filter: isRegister ? "register" : "pts",
        },
        trigger: type || true,
    });

    const handleSwitchChange = (thisType) => {
        setType(thisType);
    };

    const showScores = () => (
        <Fragment>
            {[0, 1, 2].map((ind) => {
                const css = ["first-place", "second-place", "third-place"];
                const itemsList = gotData && highestData[ind];

                const valTotal = itemsList && itemsList.value;
                const memberName = truncateWords(
                    itemsList && itemsList.name && itemsList.name.cap(),
                    13
                );

                const mainSubject = isRegister ? "Cadastros" : "PTS";

                return (
                    <div
                        key={ind}
                        className={`${css[ind]} text-purple position-absolute animated zoomIn delay-2s`}
                    >
                        {!itemsList || highestData[ind].value === 0 ? (
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
                                    ind === 0 ? "animated bounce delay-3s" : ""
                                }
                            >
                                <span
                                    style={{ top: "14px" }}
                                    className="text-nowrap position-relative text-subtitle font-weight-bold text-shadow-white"
                                >
                                    {valTotal}{" "}
                                    {Boolean(ind === 0) && mainSubject}
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
        <section className="root animated fadeIn my-3 container-center flex-column">
            <div
                className="mb-3 position-relative"
                style={{ marginTop: "30px" }}
            >
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
            <SwitchBtn
                titleLeft="PTS"
                titleRight="Cadastros"
                defaultStatus={isRegister}
                animationOn
                callback={handleSwitchChange}
            />
            <hr className="lazer-purple" />
            <style jsx global>
                {`
                    .root {
                        display: flex;
                        justify-content: center;
                    }

                    .root .podium-title {
                        font-weight: bold;
                    }

                    .root .first-place,
                    .second-place,
                    .third-place {
                        text-align: center;
                        font-weight: bold;
                        min-width: 200px;
                    }

                    .root .first-place {
                        top: -14%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                    }

                    .root .second-place {
                        top: 18%;
                        left: 17%;
                        transform: translate(-50%, -50%);
                    }

                    .root .third-place {
                        top: 26%;
                        left: 85%;
                        transform: translate(-50%, -50%);
                    }
                `}
            </style>
        </section>
    );
}
