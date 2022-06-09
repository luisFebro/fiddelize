export default function CTA() {
    return (
        <section>
            <a href="#" className="cta-btn btn-animate">
                Start
            </a>
            <style jsx>
                {`
                    .cta-btn {
                        position: relative;
                        top: -37px;
                        border: solid 10px rgb(0, 2, 15);
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
                        //filter: drop-shadow(0 0.5em 0.6em #f9ec72);
                        z-index: 100;
                        text-transform: uppercase;
                        text-decoration: none;
                        padding: 15px 60px;
                        display: inline-block;
                        border-radius: 100px;
                        transition: all 0.2s;
                    }

                    .cta-btn,
                `}
            </style>
        </section>
    );
}

/* ARCHIVES
<div className="cta-btn-gutter">
                    <style jsx>{`
                        .cta-btn-gutter {
                            position: relative;
                            z-index: -1;
                            top: -10px;
                            left: -10px;
                            right: -10px;
                            bottom: -10px;
                            width: 100%;
                            height: 100%;
                            background: rgb(0, 2, 15);
                            padding: 15px 40px;
                            display: inline-block;
                            border-radius: 100px;
                        }
                    `}
                    </style>
                </div>

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


 */
