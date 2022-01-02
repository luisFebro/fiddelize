import { useState, useEffect, Fragment } from "react";
import { useBizData } from "init";
import copyText from "utils/document/copyText";
import RadiusBtn from "components/buttons/RadiusBtn";
import { updateUser } from "api/frequent";
import getAPI, { setChallTypeData } from "api";
import showToast from "components/toasts";
import ChallComp from "./ChallComp";
import AddNewChallBtn from "./add-new-chall/AddNewChallBtn";
import BalloonPopFaq from "./BalloonPopFaq";

export default function BenefitsList({ challList, loading, setOptionData }) {
    const { bizId, bizLinkName } = useBizData();

    const [challengesArray, setChallengesArray] = useState([]);

    useEffect(() => {
        // !challengesArray.length is not presented here, then every time we update the list will overrided by the primary challList
        if (!challengesArray.length && challList && challList.length)
            setChallengesArray(challList);
        if (challengesArray && challengesArray.length)
            setOptionData((prev) => ({
                ...prev,
                beneList: challengesArray,
                updatedOnce: true,
            }));
        // eslint-disable-next-line
    }, [challList, challengesArray.length]);

    const updateLocalList = async (opts = {}) => {
        const {
            needMsg,
            deleteThisId,
            updatedData,
            updateOnlyLocalItem,
        } = opts;

        if (updateOnlyLocalItem) {
            await handleChallTypeData({
                gameName: "balloonPop",
                bizId,
            });

            return setChallengesArray((priorList) => [
                ...priorList,
                updateOnlyLocalItem,
            ]);
        }

        let newModifiedArray;
        if (deleteThisId) {
            newModifiedArray = challengesArray.filter(
                ({ id }) => id !== deleteThisId
            );

            setChallengesArray(newModifiedArray);
        }

        const dataToSend = {
            "clientAdminData.games.balloonPop.beneList":
                updatedData || newModifiedArray,
        };

        await Promise.all([
            deleteThisId
                ? handleChallTypeData({
                      gameName: "balloonPop",
                      bizId,
                      removalId: deleteThisId,
                  })
                : null,
            updateUser(bizId, "cliente-admin", dataToSend),
        ]);

        const toastMsg = deleteThisId
            ? "Benefício excluído com sucesso!"
            : "Alterações salvas!";
        if (needMsg) showToast(toastMsg, { type: "success" });
        return null;
    };

    const txtStyle = "text-normal text-left font-weight-bold";

    const showNewPrizeBtn = () => (
        <div className="container-center my-5">
            <section className="position-relative">
                <AddNewChallBtn
                    itemsCount={challengesArray.length}
                    updateLocalList={updateLocalList}
                />
            </section>
        </div>
    );

    const showGameAccess = () => {
        const gameLink = `https://fiddelize.com/${bizLinkName}/balao`;
        const showCopyBtn = () => {
            const handleCopy = () => {
                copyText(gameLink, {
                    msg: "Link copiado!",
                });
            };

            return (
                <div
                    className="container-center position-relative"
                    style={{ top: -50, zIndex: 100 }}
                >
                    <RadiusBtn
                        size="small"
                        title="copiar"
                        onClick={handleCopy}
                    />
                </div>
            );
        };

        return (
            <Fragment>
                <p className="text-normal text-purple text-break mx-3 my-5">
                    Seus clientes têm acesso aos balões aqui:
                    <br />
                    <span className="font-site text-em-0-9 font-weight-bold">
                        {gameLink}
                    </span>
                </p>
                {showCopyBtn()}
            </Fragment>
        );
    };

    return (
        <div className="mt-5">
            {loading && (
                <p className="text-normal text-center text-purple my-5">
                    carregando...
                </p>
            )}
            {!loading && !challengesArray.length && (
                <p className="text-center text-grey text-normal font-weight-bold my-5">
                    Nenhum benefício adicionado.
                </p>
            )}
            {Boolean(challengesArray.length) && (
                <p className={txtStyle}>
                    <span className="text-subtitle font-weight-bold">
                        {challengesArray.length} benefícios
                    </span>{" "}
                    adicionados:
                </p>
            )}
            {challengesArray.map((chall, ind) => (
                <div key={chall.id} className="mt-5">
                    {ind !== 0 && <p className="mb-3" />}
                    <ChallComp
                        id={chall.id}
                        desc={chall.desc}
                        challengesArray={challengesArray}
                        setChallengesArray={setChallengesArray}
                        showToast={showToast}
                        updateLocalList={updateLocalList}
                        currChallNumber={ind + 1}
                    />
                </div>
            ))}
            {showNewPrizeBtn()}
            {showGameAccess()}
            <BalloonPopFaq />
        </div>
    );
}

// HELPERS
async function handleChallTypeData({ gameName, bizId, removalId }) {
    const dataChallTypeData = {
        mode: removalId ? "remove" : "lock",
        adminId: bizId,
        userId: bizId, // userId is just for auth reasons
        gameName,
        deletedChallTypeId: removalId,
    };

    await getAPI({
        method: "post",
        url: setChallTypeData(),
        body: dataChallTypeData,
    });

    return "done";
}
// END HELPERS
