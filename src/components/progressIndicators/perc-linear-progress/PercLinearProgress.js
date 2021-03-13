import LinearProgress from "@material-ui/core/LinearProgress";
import "./_PercLinearProgress.scss";

export default function PercLinearProgress({ perc }) {
    return (
        <div
            className="position-relative mt-4 perc-linear-progress--root"
            style={{
                width: "100%",
            }}
        >
            <LinearProgress variant="determinate" value={perc} />
        </div>
    );
}
