import Navbar from "../comps/Navbar";
import getId from "utils/getId";
import copyText from "utils/document/copyText";
import Clouds from "./clouds/Clouds";

const appId = getId();

export default function ProfileContent() {
    const handleCopyBtn = () => {
        copyText(appId, {
            msg: "ID do app copiado com sucesso!",
            parentId: "copyIdBtn",
        });
    };

    const CopyBtn = () => (
        <span id="copyIdBtn" className="copy-btn-area">
            <a href="#" className="copy-btn" onClick={handleCopyBtn}>
                copiar
            </a>
            <style jsx>
                {`
                    .copy-btn-area {
                        position: relative;
                        padding-top: 5px;
                    }

                    .copy-btn {
                        cursor: pointer;
                        position: relative;
                        text-align: center;
                        font-size: 15px;
                        font-weight: 500;
                        color: #fff;
                        text-decoration: none !important;
                        z-index: 100;
                        overflow: hidden;
                        padding: 4px 16px;
                        text-shadow: 1px 1px 3px black;
                        display: inline-block;
                        border-radius: 100px;
                        background: var(--btnColor);
                    }
                `}
            </style>
        </span>
    );

    return (
        <section>
            <Navbar title="Perfil" />
            <Clouds />
            <section className="profile-info">
                <h1>Dados do Aluno</h1>
                <div>
                    <h4>Nome Aluno:</h4>
                    <span>João Augusto Lima</span>
                </div>
                <div>
                    <h4>ID App:</h4>
                    <div className="id-area-profile">
                        <span className="">{appId}</span>
                        <CopyBtn />
                    </div>
                </div>
            </section>
            <style jsx>
                {`
                    .profile-info {
                        color: #fff;
                        position: relative;
                        top: 100px;
                        margin: 100px 20px 0;
                        padding: 15px;
                        border-radius: 30px;
                        background-image: linear-gradient(
                            to left bottom,
                            #002d2a,
                            #002628,
                            #011f24,
                            #02191e,
                            #001118
                        );
                        border: solid 2px #043228;
                    }

                    .profile-info h1 {
                        font-size: 21px;
                        color: var(--txtColorDarkLight);
                        text-align: center;
                    }

                    .profile-info div h4 {
                        color: var(--txtColorDark);
                        margin-top: 5px;
                        font-size: 16px;
                    }

                    .profile-info div span {
                        display: block;
                        position: relative;
                        top: -10px;
                        color: var(--connected);
                        font-size: 22px;
                        text-align: center;
                    }

                    .id-area-profile {
                        //display: flex;
                        //align-items: center;
                        //justify-content: center;
                        //flex-row: column;
                    }
                `}
            </style>
        </section>
    );
}
