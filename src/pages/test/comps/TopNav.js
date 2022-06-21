import MuDrawerBtn from "./MuDrawerBtn";
import Settings from "styles/icons/ion/Settings";

export default function TopNav() {
    return (
        <section className="wrapper-nav-top">
            <div className="nav-top">
                <ul>
                    <MuDrawerBtn />
                    <li className="top-item logo-area text-white">
                        <figure className="">
                            <img
                                className="logo-img"
                                src="/img/febront/logo-marica2.png"
                                width={80}
                                height={70}
                                title="logo da Maricá"
                                alt="logo da Maricá"
                            />
                        </figure>
                    </li>
                    <li className="top-item">
                        <a href="#">
                            <span className="icon">
                                <Settings />
                            </span>
                        </a>
                    </li>
                </ul>
            </div>
            <style jsx>
                {`
                    .wrapper-nav-top {
                        position: relative;
                    }

                    .nav-top {
                        position: relative;
                        background: transparent;
                        border-radius: 10px;
                    }

                    .nav-top ul {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                        display: flex;
                        justify-content: space-around;
                        align-items: center;
                        line-height: 70px;
                        padding: 0;
                        margin: 0;
                    }

                    .nav-top ul li {
                        position: relative;
                        list-style: none;
                        height: 70px;
                        z-index: 1;
                    }

                    .nav-top ul li.logo-area {
                        margin: 0 50px 0;
                    }

                    .nav-top ul li.logo-area .logo-img {
                        position: relative;
                        top: 13px;
                    }

                    .nav-top ul li a .icon {
                        position: relative;
                        display: block;
                        font-size: 1.2em;
                        text-align: center;
                        transition: 0.5s;
                        color: #fff;
                    }

                    .nav-top ul li a {
                        position: relative;
                        display: flex;
                        width: 100%;
                        justify-content: center;
                        align-items: center;
                    }
                `}
            </style>
        </section>
    );
}
