import React, { Fragment } from "react";
import AppCard from "./AppCard";

export default function AppList() {
    const itemAmount = 150.5;

    const installedApps = [
        {
            bizId: "123s",
            bizImg:
                "https://res.cloudinary.com/fiddelize/image/upload/v1602846305/you-vipp-shop-yvczdd8.png",
            bizName: "Cherry's Beauty",
            role: "cliente-admin",
            isDefaultAccess: true,
        },
        {
            bizId: "1432s",
            bizImg:
                "https://res.cloudinary.com/fiddelize/image/upload/v1602079714/you-vipp-shop-yvsffp932.png",
            bizName: "You Vipp Shop",
            role: "cliente",
            isDefaultAccess: false,
        },
        {
            bizId: "123123141s",
            bizImg: "/img/official-logo-name.png",
            bizName: "Fiddelize",
            role: "cliente-membro",
            isDefaultAccess: false,
        },
        {
            bizId: "1231231s",
            bizImg: "/img/official-logo-name.png",
            bizName: "Fiddelize",
            role: "nucleo-equipe",
            isDefaultAccess: false,
        },
    ];
    const error = false;

    const totalApps = installedApps && installedApps.length;
    const plural = totalApps === 1 ? "" : "s";
    const showTotalApps = () => (
        <p className="text-p text-normal my-3 text-left">
            <span className="font-weight-bold">Total:</span> {totalApps} app
            {plural} instalado{plural}.
        </p>
    );

    if (error) {
        return (
            <p className="text-subtitle text-red font-weight-bold mx-3 my-5">
                Um erro aconteceu ao iniciar a sessão. Tente abrir novamente.
            </p>
        );
    }

    return (
        <section
            className="mt-3"
            style={{
                marginBottom: "150px",
            }}
        >
            {!installedApps ? (
                <p className="text-normal text-purple font-weight-bold">
                    Verificando disponíveis... here goes skeleton instead
                </p>
            ) : (
                <Fragment>
                    <p className="text-subtitle text-purple font-weight-bold">
                        Selecione app.
                    </p>
                    {showTotalApps()}
                </Fragment>
            )}
            <section className="container">
                <div className="row">
                    {installedApps &&
                        installedApps.map((app) => (
                            <Fragment key={app.bizId}>
                                <AppCard data={app} />
                            </Fragment>
                        ))}
                </div>
            </section>
        </section>
    );
}
