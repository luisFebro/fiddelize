export default function TopNav() {
    return (
        <section className="wrapper-nav-top">
            <div className="nav-top">
                <ul>
                    <li className="top-item">
                        <a href="#">
                            <span className="icon">
                                <ion-icon name="grid"></ion-icon>
                            </span>
                        </a>
                    </li>
                    <li className="top-item name-area text-white">
                        <span className="name fani">fani</span>
                        <span className="name vpn font-weight-bold">VPN</span>
                    </li>
                    <li className="top-item">
                        <a href="#">
                            <span className="icon">
                                <ion-icon name="settings"></ion-icon>
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
                        //width: 350px;
                    }

                    .nav-top ul li {
                        position: relative;
                        list-style: none;
                        height: 70px;
                        z-index: 1;
                    }

                    .nav-top ul li.name-area {
                        font-size: 1.5em;
                        margin: 0 50px;
                    }

                    .nav-top ul li .name.fani {
                        //font-family: none;
                    }

                    .nav-top ul li .name.vpn {
                        //font-family: none;
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
                        //flex-direction: column;
                        //text-align: center;
                        //font-weight: 500;
                    }
                `}
            </style>
        </section>
    );
}
