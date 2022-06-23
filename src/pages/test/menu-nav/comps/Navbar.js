export default function Navbar({ title = "Perfil" }) {
    return (
        <section className="upper-navbar-wrapper">
            <div className="marica-upper-navigation">
                <span>{title}</span>
            </div>
            <style jsx>
                {`
                    .upper-navbar-wrapper {
                        position: relative;
                        z-index: 1000;
                        width: 100%;
                        //height: 50px;
                    }

                    .upper-navbar-wrapper .marica-upper-navigation {
                        margin: 0;
                        padding: 17px 0;
                        display: flex;
                        justify-content: center;
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

                    .upper-navbar-wrapper .marica-upper-navigation span {
                        color: #fff;
                        font: normal 20px var(--mainFont);
                    }
                `}
            </style>
        </section>
    );
}
