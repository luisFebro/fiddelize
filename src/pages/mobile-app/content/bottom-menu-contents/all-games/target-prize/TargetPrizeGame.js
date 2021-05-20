import { Fragment } from "react";
import useContext from "context";
import { Load } from "components/code-splitting/LoadableComp";
import RatingIcons from "./RatingIcons";
import Gift from "./Gift";
import GameCTAs from "../ctas/GameCTAs";
// All component pages which are using both in website and mobile app goes here in next updates...

export const AsyncProgressFragTracker = Load({
    loader: () =>
        import(
            "./ProgressFragTracker" /* webpackChunkName: "progress-frag-tracker-comp-lazy" */
        ),
});

export default function TargetPrizeGame({ didUserScroll }) {
    const { needAppForPreview } = useContext();

    const showRatingIcons = () => (
        <div
            className={`position-relative ${
                needAppForPreview && "enabledLink"
            }`}
        >
            <RatingIcons />
        </div>
    );

    return (
        <section className="text-center">
            {didUserScroll && (
                <Fragment>
                    <div className="mb-5" />
                    <Gift />
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
            {didUserScroll && <GameCTAs />}
        </section>
    );
}
