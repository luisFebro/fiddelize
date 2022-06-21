import { useEffect, useState } from "react";
import MenuNavHandler from "pages/test/menu-nav/MenuNavHandler";
import Person from "styles/icons/ion/Person";
import Home from "styles/icons/ion/Home";
import DocumentText from "styles/icons/ion/DocumentText";

export default function MagicNavMenuIndicator() {
    const [currPage, setCurrPage] = useState("home");

    useEffect(() => {
        const list = document.querySelectorAll(".bottom-item");

        function activeLink() {
            list.forEach((item) => item.classList.remove("active"));
            this.classList.add("active");
        }

        list.forEach((item) => item.addEventListener("click", activeLink));
    }, []);

    const handleMenuClick = (clickedMenu) => {
        setCurrPage(clickedMenu);
    };

    return (
        <section className="magic-nav-wrapper">
            <div className="navigation">
                <ul>
                    <li className="bottom-item">
                        <a href="#" onClick={() => handleMenuClick("logs")}>
                            <span className="icon svg-elevation">
                                <DocumentText />
                            </span>
                            <span className="text">Registros</span>
                        </a>
                    </li>
                    <li className="bottom-item active">
                        <a href="#" onClick={() => handleMenuClick("home")}>
                            <span className="icon svg-elevation">
                                <Home />
                            </span>
                            <span className="text">Início</span>
                        </a>
                    </li>
                    <li className="bottom-item">
                        <a href="#" onClick={() => handleMenuClick("profile")}>
                            <span className="icon svg-elevation">
                                <Person />
                            </span>
                            <span className="text">Perfil</span>
                        </a>
                    </li>
                    <div className="indicator" />
                </ul>
            </div>
            <MenuNavHandler currMenu={currPage} />
            <style jsx global>
                {`
                    .magic-nav-wrapper {
                        z-index: 1000;
                        position: fixed;
                        bottom: 0;
                        left: 50%;
                        transform: translateX(-50%);
                    }

                    .navigation {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                        position: relative;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 400px;
                        height: 70px;
                        background-image: linear-gradient(
                            to bottom,
                            #0f3129,
                            #062928,
                            #032225,
                            #031a21,
                            #01121a
                        );
                        border-radius: 10px 10px 0px 0px;
                    }

                    .navigation ul {
                        display: flex;
                        padding: 0;
                        margin: 0;
                        box-sizing: border;
                        width: 350px;
                    }

                    .navigation ul li {
                        position: relative;
                        list-style: none;
                        width: 120px;
                        height: 120px;
                        z-index: 1;
                    }

                    .navigation ul li a {
                        position: relative;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        flex-direction: column;
                        width: 100%;
                        text-align: center;
                        font-weight: 500;
                    }

                    .navigation ul li a .icon {
                        position: relative;
                        display: block;
                        line-height: 125px;
                        font-size: 1.5em;
                        text-align: center;
                        transition: 0.5s;
                        color: #3c5c59;
                    }

                    .navigation ul li.active a .icon {
                        color: #fff;
                        transform: translateY(-35px);
                    }

                    .navigation ul li a .text {
                        position: absolute;
                        color: #fff;
                        font-weight: 400;
                        font-size: 0.75em;
                        opacity: 0;
                        transform: translateY(20px);
                        letter-spacing: 0.05em;
                        transition: 0.5s;
                    }

                    .navigation ul li.active a .text {
                        opacity: 1;
                        transform: translateY(10px);
                    }

                    .indicator {
                        position: absolute;
                        width: 70px;
                        height: 70px;
                        top: -50%;
                        left: 11.2%;
                        border-radius: 50%;
                        border: 6px solid #00020f;
                        transition: 0.5s;
                        background-image: linear-gradient(
                            to bottom,
                            #ffb600,
                            #ffaa00,
                            #ff9d00,
                            #fe9100,
                            #fd8401
                        ); /*#eeab48*/
                    }

                    .indicator::before {
                        content: "";
                        position: absolute;
                        top: 50%;
                        left: -22px;
                        width: 20px;
                        height: 20px;
                        background: transparent;
                        border-top-right-radius: 20px;
                        box-shadow: 1px -10px 0 0 #00020f;
                    }

                    .indicator::after {
                        content: "";
                        position: absolute;
                        top: 50%;
                        right: -22px;
                        width: 20px;
                        height: 20px;
                        background: transparent;
                        border-top-left-radius: 20px;
                        box-shadow: 0px -10px 0 0 #00020f;
                    }

                    .navigation ul li:nth-child(1).active ~ .indicator {
                        transform: translateX(calc(120px * 0));
                    }

                    .navigation ul li:nth-child(2).active ~ .indicator {
                        transform: translateX(calc(120px * 1));
                    }

                    .navigation ul li:nth-child(3).active ~ .indicator {
                        transform: translateX(calc(120px * 2));
                    }
                `}
            </style>
        </section>
    );
}
