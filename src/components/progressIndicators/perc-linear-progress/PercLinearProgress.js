import LinearProgress from "@material-ui/core/LinearProgress";
import getId from "utils/getId";

export default function PercLinearProgress({ perc, color = "var(--themeP)" }) {
    // so that we apply css individually for each progress in this page, ohterwise the last one will prevail against the previoysly added
    const uniqueId = getId();
    return (
        <section>
            <div
                className="position-relative mt-4 perc-linear-progress--root"
                style={{
                    width: "100%",
                }}
            >
                <LinearProgress
                    id={uniqueId}
                    className="linear-progress"
                    variant="determinate"
                    value={perc}
                    style={{
                        color,
                    }}
                />
            </div>
            <style jsx global>
                {`
                    .MuiLinearProgress-root {
                        height: 10px;
                        border-radius: 5px;
                    }

                    #${uniqueId}.MuiLinearProgress-root .MuiLinearProgress-bar {
                        background-color: ${color} !important;
                        border-radius: 5px;
                    }

                    .MuiLinearProgress-colorPrimary {
                        background-color: #dac0f8;
                    }
                `}
            </style>
        </section>
    );
}
