import PropTypes from "prop-types";
import CarouselFlickity from "../../../../components/carousels/CarouselFlickity";
import { milestoneIcons } from "../../../../global-data/milestoneIcons";
import {
    milestoneIconsSorted,
    getIconIndex,
} from "../../../../global-data/milestoneIconsSorted";
import useData from "init";

PickRatingIcon.propTypes = {
    step: PropTypes.number,
    setNextDisabled: PropTypes.func,
};

export default function PickRatingIcon({
    step,
    setNextDisabled,
    isTest,
    isFromDash,
}) {
    const selectedMilestoneIcons = isFromDash
        ? milestoneIconsSorted
        : milestoneIcons.filter((iconObj) => iconObj.appPreview === true);
    const showCondition = isFromDash ? true : step === 3;

    const { adminGame } = useData();
    const { milestoneIcon } = adminGame.targetPrize;

    const currIconInd = getIconIndex(milestoneIcon);
    // n1
    return (
        <div
            style={{
                visibility: showCondition ? "visible" : "hidden",
                height: showCondition ? 260 : 0,
            }}
        >
            {isFromDash ? (
                <p className="text-normal text-purple text-center">
                    • Selecione outro ícone de nível principal:
                </p>
            ) : (
                <p className="text-normal text-white text-shadow text-center">
                    • Selecione ícone de nível do app:
                </p>
            )}
            <CarouselFlickity
                data={selectedMilestoneIcons}
                isFromDash={isFromDash}
                currIconInd={isFromDash ? currIconInd : 0}
                style={{
                    maxWidth: isFromDash && "100%",
                    boxShadow:
                        isFromDash && "0 31px 120px -6px rgba(0, 0, 0, 0.35)",
                }}
            />
            {!isFromDash && (
                <p className="text-small text-white text-shadow text-left">
                    * mais ícones ficarão disponíveis
                    <br />
                    em seu painel de controle.
                </p>
            )}
        </div>
    );
}

/* COMMENTS
n1: This only works with visibility. If I do not display at the first rendering,
there will be a structure failure.
*/
