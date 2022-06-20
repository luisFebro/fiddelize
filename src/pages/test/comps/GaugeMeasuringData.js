export default function GaugeMeasuringData() {
    return (
        <section>
            <section className="gauge-measuring--root">
                <div>
                    <span className="triangle--root">
                        <div className="triangle triangle-down" />
                    </span>
                    <div className="">
                        <p>
                            <span>32.1</span>mb/s
                        </p>
                        <p className="sub-title">Baixado</p>
                    </div>
                </div>
                <div>
                    <div className="triangle--root">
                        <div className="triangle triangle-up" />
                    </div>
                    <div className="">
                        <p>
                            <span>21.7</span>mb/s
                        </p>
                        <p className="sub-title">Envio</p>
                    </div>
                </div>
            </section>
            <style jsx>
                {`
                    .gauge-measuring--root {
                        position: relative;
                        z-index: 100;
                        display: flex;
                        justify-content: space-around;
                        align-items: center;
                    }

                    .gauge-measuring--root .triangle--root {
                        margin-right: 10px;
                    }

                    .gauge-measuring--root div {
                        display: flex;
                        justify-content: space-around;
                        align-items: center;
                    }

                    .gauge-measuring--root div div {
                        display: flex;
                        flex-direction: column;
                    }

                    .gauge-measuring--root div div p {
                        color: #fff;
                        margin: 0;
                        font-size: 11px;
                        font-weight: bold;
                        font-family: var(--mainFont);
                    }

                    .gauge-measuring--root div div p span {
                        font-size: 18px;
                        margin-right: 5px;
                    }

                    .gauge-measuring--root div div .sub-title {
                        color: var(--txtColorDark);
                    }

                    .triangle {
                        display: inline-block;
                        width: 10px;
                        height: 5px;
                    }

                    .triangle-up {
                        border-bottom: solid 8px #ff9800;
                        border-left: solid 8px transparent;
                        border-right: solid 8px transparent;
                    }

                    .triangle-down {
                        border-top: solid 8px #1cf499;
                        border-left: solid 8px transparent;
                        border-right: solid 8px transparent;
                    }
                `}
            </style>
        </section>
    );
}
