import { useEffect } from "react";
import "./GaugeArch.scss";

export default function GaugeArch({ connectStatus, setConnectStatus }) {
    useEffect(() => {
        const meterContainer = document.querySelector(".meter-container");
        if (!meterContainer) return;

        if (connectStatus === "connected") {
            // forcing green color...
            setConnectStatus("connected");
            setTimeout(() => {
                meterContainer.classList.add("connect-stabilize");
            }, 6000);
        } else {
            meterContainer.classList.remove("connect-stabilize");
        }
    }, [connectStatus]);

    return (
        <section
            className={`meter-container ${connectStatus}`}
            style={{
                ["--fill"]:
                    connectStatus === "disconnected"
                        ? "transparent"
                        : `var(--${connectStatus})`,
            }}
        >
            <div className={`bottom-brick right ${connectStatus}`} />
            <div className={`bottom-brick left ${connectStatus}`} />
            <div className={`bottom-line ${connectStatus}`} />
            <div className={`bottom-brick ground ${connectStatus}`} />
        </section>
    );
}
