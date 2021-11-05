// import { useState } from "react";
import PropTypes from "prop-types";

AttentionWaves.propTypes = {
    waveSize: PropTypes.string,
};

// const wave = (props) => keyframes`
//     to { box-shadow: 0 0 0 ${props.waveSize || "30px"} ${
//     props.waveColor || "rgba(34, 229, 235, 0.3)"
// };
// `;

// const Div = styled.div`
//     & {
//         animation: ${({ cssProps }) => wave(cssProps)}
//     }
// `;

// position absolute by default. Use it ideally above the desire button/element
// and wrapped up with a relative position...

export default function AttentionWaves({ isActive, waveColor, waveSize }) {
    // const [stopWave, setStopWave] = useState(false);

    return (
        isActive && (
            <section
                style={{ boxShadow: waveColor }}
                className="root pulse-waves pulse-button"
            >
                <span style={{ visibility: "hidden" }}>.</span>
                <style jsx>
                    {`
                        .root {
                            animation: wave 1.25s infinite
                                cubic-bezier(0.66, 0, 0, 1) !important;
                        }

                        @keyframes wave {
                            to {
                                box-shadow: 0 0 0 ${waveSize || "30px"}
                                    ${waveColor || "rgba(34, 229, 235, 0.3)"};
                            }
                        }
                    `}
                </style>
            </section>
        )
    );
}
