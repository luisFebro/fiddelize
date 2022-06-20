export default function Navbar({ title = "Perfil" }) {
    return (
        <section className="upper-navbar-wrapper">
            <div className="navigation">
                <span>{title}</span>
            </div>
            <style jsx>
                {`
                    .upper-navbar-wrapper {
                        position: fixed;
                        top: 0;
                        z-index: 1000;
                        width: 100%;
                    }

                    .upper-navbar-wrapper .navigation {
                        margin: 0;
                        display: flex;
                        justify-content: center;
                        height: 50px;
                        box-sizing: border-box;
                        position: relative;
                        background-image: linear-gradient(
                            to bottom,
                            #0f3129,
                            #062928,
                            #032225,
                            #031a21,
                            #01121a
                        );
                        border-radius: 0px 0px 10px 10px;
                    }

                    .upper-navbar-wrapper .navigation span {
                        color: #fff;
                        font: normal 20px var(--mainFont);
                    }
                `}
            </style>
        </section>
    );
}
