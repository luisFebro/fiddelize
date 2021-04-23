import useContext from "context";
import RatingIcons from "./RatingIcons";
import ProgressFragTracker from "./ProgressFragTracker";
import Gift from "./Gift";

export default function TargetPrizeGame() {
    const {
        userId,
        needAppForPreview,
        arePrizesVisible,
        prizeDesc,
        selfMilestoneIcon,
        runName,
        currScore,
        maxScore,
        backColorSelect,
        colorS,
        selectTxtStyle,
        showMoreComps,
    } = useContext();

    const showRatingIcons = () => (
        <div
            className={`position-relative ${
                needAppForPreview && "enabledLink"
            }`}
        >
            <RatingIcons
                currScore={currScore}
                maxScore={maxScore}
                colorBack={backColorSelect}
                colorS={colorS}
                selectTxtStyle={selectTxtStyle}
                selfMilestoneIcon={selfMilestoneIcon}
                runName={runName}
            />
        </div>
    );

    return (
        <section className="text-hero text-center text-white">
            <div className="mb-5" />
            <Gift
                prizeDesc={prizeDesc}
                userId={userId}
                arePrizesVisible={arePrizesVisible}
                rewardDeadline={30}
                showMoreComps={showMoreComps}
            />
            <div className="mb-3" />
            {showRatingIcons()}
            <div style={{ marginBottom: 100 }} />
            <ProgressFragTracker />
            <div style={{ marginBottom: 100 }} />
        </section>
    );
}
