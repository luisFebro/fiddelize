import LoadableComp from "../code-splitting/LoadableComp";
import Spinner from "../loadingIndicators/Spinner";

const AsyncBellNotifBtn = LoadableComp({
    // n1
    loader: () =>
        import("./BellNotifBtn" /* webpackChunkName: "bell-btn-comp-lazy" */),
    loading: () => (
        <div className="my-4">
            <Spinner size="large" />
        </div>
    ),
});

export default AsyncBellNotifBtn;
