import { Fragment } from "react";
import useContext from "context";
import { Load } from "components/code-splitting/LoadableComp";
import { currTxtColor } from "utils/biz/selectTxtStyle";
import RatingIcons from "./RatingIcons";
import Gift from "./Gift";
import GamesGalleryBtn from "../games-gallery-btn/GamesGalleryBtn";
// All component pages which are using both in website and mobile app goes here in next updates...

export const AsyncProgressFragTracker = Load({
    loader: () =>
        import(
            "./ProgressFragTracker" /* webpackChunkName: "progress-frag-tracker-comp-lazy" */
        ),
});

export default function TargetPrizeGame({ didUserScroll }) {
    const {
        userId,
        needAppForPreview,
        arePrizesVisible,
        prizeDesc,
        selfMilestoneIcon,
        runName,
        currScore,
        maxScore,
        colorBack,
        colorS,
        selectTxtStyle,
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
                colorBack={colorBack}
                colorS={colorS}
                selectTxtStyle={selectTxtStyle}
                selfMilestoneIcon={selfMilestoneIcon}
                runName={runName}
            />
        </div>
    );

    const thisCurrTxtColor = currTxtColor(colorBack);
    const showGamesGalleryBtn = () => (
        <GamesGalleryBtn
            thisCurrTxtColor={thisCurrTxtColor}
            colorS={colorS}
            colorBack={colorBack}
        />
    );

    return (
        <section className="text-center">
            {didUserScroll && (
                <Fragment>
                    <div className="mb-5" />
                    <Gift
                        prizeDesc={prizeDesc}
                        userId={userId}
                        arePrizesVisible={arePrizesVisible}
                        rewardDeadline={30}
                    />
                </Fragment>
            )}
            <div className="mb-3" />
            {showRatingIcons()}
            <div style={{ marginBottom: 100 }} />
            {didUserScroll && (
                <Fragment>
                    <AsyncProgressFragTracker />
                    <div style={{ marginBottom: 100 }} />
                </Fragment>
            )}
            {didUserScroll && (
                <section className="my-5 container-center">
                    {showGamesGalleryBtn()}
                </section>
            )}
            <div className="showMoreCompsByScroll" />
        </section>
    );
}
