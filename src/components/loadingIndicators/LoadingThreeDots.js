// Three-dot bouncing loading effect
// Resource: https://codepen.io/danielmorosan/pen/XmYBVx

export default function LoadingThreeDots({
    color = "var(--themeP)",
    disableTxt = true,
    filterColor, // drop-shadow(0.001em 0.1em 0.1em grey)
}) {
    return (
        <section className="container-center">
            <main className="loading-container">
                {!disableTxt && <h2 className="main-font">Carregando</h2>}
                <div className="spinner">
                    <div className="bounce1" />
                    <div className="bounce2" />
                    <div className="bounce3" />
                </div>
            </main>
            <style jsx>
                {`
                    .loading-container {
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                        align-items: center;
                    }

                    .spinner {
                        display: flex;
                        flex-flow: row no-wrap;
                        //margin: 100px auto 0;
                        width: 100%;
                        text-align: center;
                        filter: ${filterColor || "none"};
                    }

                    .spinner > div {
                        margin: 7px;
                        width: 9px;
                        height: 9px;

                        border-radius: 100%;
                        display: inline-block;
                        animation: bounceDots 1.4s infinite ease-in-out both;
                    }

                    .spinner .bounce1 {
                        animation-delay: -0.32s;
                    }

                    .spinner .bounce2 {
                        animation-delay: -0.16s;
                    }

                    @keyframes bounceDots {
                        0%,
                        80%,
                        100% {
                            transform: scale(0);
                        }
                        40% {
                            transform: scale(1);
                        }
                    }
                `}
            </style>
            <style jsx>
                {`
                    .loading-container {
                        color: ${color};
                    }

                    .spinner > div {
                        background-color: ${color || "#333"};
                    }
                `}
            </style>
        </section>
    );
}
