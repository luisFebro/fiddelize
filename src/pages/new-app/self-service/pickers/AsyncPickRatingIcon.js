import LoadableComp from "../../../../components/code-splitting/LoadableComp";
import Spinner from "../../../../components/loadingIndicators/Spinner";
import { IS_DEV } from "../../../../config/clientUrl";

const AsyncPickRatingIcon = LoadableComp({
    // n1
    loader: () =>
        import(
            "./PickRatingIcon" /* webpackChunkName: "pick-icons-comp-lazy" */
        ),
    loading: () =>
        IS_DEV ? null : (
            <Spinner marginY={50} width={200} height={200} size="large" />
        ),
});

export default AsyncPickRatingIcon;
