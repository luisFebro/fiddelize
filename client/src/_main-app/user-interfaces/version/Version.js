import React, { useEffect, Fragment } from 'react';
import ModalBtn from '../../../components/buttons/ModalBtn';
import imgLib, { ImgLoader } from '../../../utils/storage/lForageStore';

const latestVersion = "3.2202.3"
const updateDescription = "painel de controle admin - lista automática de tarefas - rolagem infinita pt 5";
const history = [
    "Galeria de Prêmios (finalizado)",
    "novo modelo de requisições HTTP - cliente com axios ",
    "Otimização completa do algoritmo do histórico de compra || otimização UI sessão histórico de compras pt 8 (finalizado)",
    "Componentes e Sistema de Notificações - integração de funciolidades interface, design finalizado",
    "Componentes e Sistema de Notificações - concluído implementação completa no backend",
    "Painel de Controle - simplificação processo card teste || melhorias teclado || algoritmo modo progressivo || melhorias no sistema de pontuação cli-admin || otimização algoritmo do historico de compras",
    "Login/Acesso - Novo status para verificar novidades em funcionalidades com página de atualização",
]



export default function AppVersion({ position = "relative", bottom, left }) {
    return (
        <section className={`position-${position}`} style={{bottom, left}}>
            <section className="position-relative">
                <main
                    style={{
                        backgroundColor: 'black',
                        borderRadius: '30px',
                        color: 'white',
                        padding: '4px 5px',
                        fontSize: '18px',
                        border: '3px solid white',
                        marginBottom: '10px',
                        marginLeft: '10px',
                        width: '140px',
                    }}
                    className="app-version text-small text-center"
                >
                    Versão {latestVersion}
                </main>
                <div className="position-absolute" style={{left: 155, top: 0}}>
                    <ModalBtn modalComp={<FeatureUpdates />} />
                </div>
            </section>
        </section>
    );
}

const FeatureUpdates = () => {
    const isSmall = React.useCallback(window.Helper.isSmallScreen(), []);

    useEffect(() => imgLib.app_version_feature_illustra2, [])

    const showTitle = () => (
        <div className="my-4">
            <p
                className="text-subtitle text-purple text-center font-weight-bold"
            >
                &#187; Atualizações App
            </p>
        </div>
    );

    const showMainContent = () => (
        <div
            className="animated fadeInUp delay-1s"
            onClick={null}
        >
            <header>
                <h1 className="text-title text-purple text-center mb-3">
                    Versão {latestVersion}
                </h1>
            </header>
            <div className="text-normal text-purple mx-3 mb-3">
                <h2 className="text-center text-subtitle">Última Atualização:</h2>
                {updateDescription}
            </div>
        </div>
    );

    return(
        <Fragment>
            {showTitle()}
            <div className="container-center mx-3">
                <ImgLoader
                    className="app_version_feature_illustra2 img-fluid"
                    height="auto"
                    style={{maxHeight: !isSmall ? '110px' : '120px', width: '120px'}}
                    alt="novidades"
                />
            </div>
            {showMainContent()}
        </Fragment>
    );
};