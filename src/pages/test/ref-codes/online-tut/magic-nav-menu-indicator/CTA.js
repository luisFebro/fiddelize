export default function CTA() {
    return (
        <section>
            <a href="#" className="cta-btn btn-animate">
                Start
            </a>
            <style jsx>
                {`
                    .cta-btn {
                        border: solid 10px rgb(0, 2, 15);
                        margin: 20px;
                        break-words: no-break;
                        font-weight: bold;
                        color: #fff;
                        background-image: linear-gradient(
                            to bottom,
                            #ffb600,
                            #ffaa00,
                            #ff9d00,
                            #fe9100,
                            #fd8401
                        );
                        z-index: 100;
                    }

                    .cta-btn,
                    .btn:visited {
                        text-transform: uppercase;
                        text-decoration: none;
                        padding: 15px 40px;
                        display: inline-block;
                        border-radius: 100px;
                        transition: all 0.2s;
                        position: absolute;
                    }

                    .cta-btn::after {
                        content: "";
                        display: inline-block;
                        height: 100%;
                        width: 100%;
                        border-radius: 100px;
                        position: absolute;
                        top: 0;
                        left: 0;
                        z-index: -1;
                        transition: all 0.4s;
                    }
                `}
            </style>
        </section>
    );
}
