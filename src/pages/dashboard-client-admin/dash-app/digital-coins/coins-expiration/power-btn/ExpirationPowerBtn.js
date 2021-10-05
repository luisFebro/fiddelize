import { useState, useEffect, Fragment } from "react";
import PowerBtn from "components/buttons/power-btn/PowerBtn";
import { Load } from "components/code-splitting/LoadableComp";
import { useReadUser, updateUser } from "api/frequent";
import showToast from "components/toasts";
import parse from "html-react-parser";
import useData, { useBizData } from "init";
import getAPI, { setExpiringCoinsToBase, getExpiringTotalsAndDates } from "api";
import { fromNow, addDays } from "utils/dates/dateFns";
import getDayMonthBr from "utils/dates/getDayMonthBr";
import ButtonFab from "components/buttons/material-ui/ButtonFab";

const AsyncModalYesNo = Load({
    loader: () =>
        import(
            "components/modals/ModalYesNo" /* webpackChunkName: "yes-no-modal-lazy" */
        ),
});

const AsyncModalActivateExpiringCoins = Load({
    loader: () =>
        import(
            "./ModalActivateExpiringCoins" /* webpackChunkName: "activate-expiring-coins-modal-lazy" */
        ),
});

export default function ExpirationPowerBtn() {
    const [data, setData] = useState({
        on: false,
        daysCount: 0,
        isMaintenanceMonth: false, // if cli-user doesn't continue pay, the expiration is auto activate for 1 month of maintenance
        activationDate: null,
        gotPendingNewClients: true,
        isPendingMode: false,
        pendingModeData: {
            pendingNewClientsCount: 0,
            clientsWithExpBalanceCount: 0,
            lastClientExpDate: new Date(),
        },
    });

    const [openModalDeactivate, setOpenModalDeactivate] = useState(false);
    const [openModalActivate, setOpenModalActivate] = useState(false);
    const {
        on,
        daysCount,
        activationDate,
        isMaintenanceMonth,
        gotPendingNewClients,
        isPendingMode,
        pendingModeData,
    } = data;

    const { userId } = useData();
    const isCoreAdmin = userId === "5e8b0bfc8c616719b01abc9c";

    const { bizName, bizLogo } = useBizData();

    useEffect(() => {
        (async () => {
            const thisPendingModeData = await getAPI({
                url: getExpiringTotalsAndDates(userId),
            });

            setData((prev) => ({
                ...prev,
                isPendingMode: !on && gotPendingNewClients,
                pendingModeData: thisPendingModeData,
            }));
        })();

        return null;
    }, [on, userId, gotPendingNewClients]);

    const { data: dataUser, loading, error } = useReadUser(
        userId,
        "cliente-admin",
        "clientAdminData.expiringCoinsDeadline",
        {
            trigger: userId,
        }
    );

    const expiringCoinsDeadline =
        dataUser &&
        dataUser.clientAdminData &&
        dataUser.clientAdminData.expiringCoinsDeadline;

    useEffect(() => {
        if (!expiringCoinsDeadline) return;

        setData((prev) => ({
            ...prev,
            on: expiringCoinsDeadline.on,
            daysCount: expiringCoinsDeadline.daysCount,
            activationDate: expiringCoinsDeadline.activationDate,
            isMaintenanceMonth: expiringCoinsDeadline.isMaintenanceMonth,
            gotPendingNewClients: expiringCoinsDeadline.gotPendingNewClients,
        }));
    }, [expiringCoinsDeadline]);

    const getModalCallback = async (activationData) => {
        const isDeactivated = Boolean(!activationData);

        setData((prev) => ({
            ...prev,
            on: !isDeactivated,
            daysCount: activationData ? activationData.pickedDaysCount : 0,
            gotPendingNewClients: !isDeactivated,
        }));

        // DB HANDLING
        const role = "cliente-admin";

        const expirationDate = !isDeactivated
            ? addDays(new Date(), activationData.pickedDaysCount)
            : null;
        const nearExpDate = !isDeactivated
            ? addDays(new Date(expirationDate), isCoreAdmin ? -2 : -5)
            : null;

        const body = {
            "clientAdminData.expiringCoinsDeadline.on": !isDeactivated,
            // this will only be deactivated if cli-user manually do it, or in the cron-job algo when detecting no customers are available after the regular exp date defined by cli-admin
            // a new pending clients panel will pop up when the func is auto deactivated when the cli-admin deadline is up and this variable is true, indicating that although expired to prior registerd cli-users, thre are still customized expiring date for new clients
            "clientAdminData.expiringCoinsDeadline.gotPendingNewClients": !isDeactivated,
            "clientAdminData.expiringCoinsDeadline.activationDate": isDeactivated
                ? null
                : new Date(),
            "clientAdminData.expiringCoinsDeadline.nearExpDate": isDeactivated
                ? null
                : nearExpDate,
            "clientAdminData.expiringCoinsDeadline.expirationDate": isDeactivated
                ? null
                : expirationDate,
            "clientAdminData.expiringCoinsDeadline.daysCount": isDeactivated
                ? 0
                : activationData.pickedDaysCount,
        };

        const adminData = !isDeactivated
            ? {
                  bizName,
                  bizLogo,
                  expirationDate: addDays(
                      new Date(),
                      activationData.pickedDaysCount
                  ),
                  daysCount: activationData.pickedDaysCount,
              }
            : undefined;

        // deactivate is very fast, while a msg to activate is required because involves more db data process and notifs sending
        if (!isDeactivated) showToast("Ativando expiração...");

        await Promise.all([
            updateUser(userId, role, body).catch((err) => {
                showToast("Ocorreu um erro ao atualizar", { type: "error" });
                console.log(`ERROR: ${err}`);
            }),
            // send notifs and emails to all customers base
            getAPI({
                method: "POST",
                url: setExpiringCoinsToBase(),
                body: {
                    userId,
                    toggle: !isDeactivated,
                    adminData,
                },
                errMsg: true,
            }),
        ]);

        if (!isDeactivated)
            return showToast(
                "Funcionalidade de expiração de moedas foi ativada com sucesso!",
                { type: "success" }
            );
        return showToast(
            "Funcionalidade de expiração de moedas foi desativada."
        );
        // END DB HANDLING
    };

    const showExpiredCliTotal = () => (
        <section className="text-center my-5 text-normal text-grey">
            <h2 className="text-normal font-weight-bold">
                TOTAL SALDOS EXPIRADOS
            </h2>
            <p className="font-site text-em-1">
                <span
                    className="text-pill text-shadow"
                    style={{ backgroundColor: "grey" }}
                >
                    {pendingModeData.clientsWithExpBalanceCount} vezes
                </span>{" "}
                até agora.
            </p>
        </section>
    );

    const showMainButton = () => (
        <Fragment>
            {isPendingMode ? (
                <section className="text-center mx-3 my-5 text-normal text-grey">
                    <section>
                        <h2 className="text-normal text-purple font-weight-bold">
                            CLIENTES COM EXPIRAÇÃO PENDENTE
                        </h2>
                        <p className="text-left">
                            <span
                                className="text-shadow text-pill"
                                style={{ backgroundColor: "grey" }}
                            >
                                {pendingModeData.pendingNewClientsCount}{" "}
                                clientes pendentes
                            </span>{" "}
                            porque registraram após a ativação da expiração com
                            datas diferentes iniciado a partir da data de
                            cadastro.
                        </p>
                        <p className="text-left">
                            A data do{" "}
                            <span className="text-underline text-grey">
                                último cliente
                            </span>{" "}
                            a expirar é dia:
                            <br />
                            <strong>
                                {getDayMonthBr(
                                    pendingModeData.lastClientExpDate,
                                    { needYear: true }
                                )}
                            </strong>
                        </p>
                    </section>
                    <div className="my-4 mx-1 container-center">
                        <ButtonFab
                            title="Cancelar Pendentes"
                            width="100%"
                            backgroundColor="var(--mainRed)"
                            onClick={() => setOpenModalDeactivate(true)}
                            position="relative"
                            variant="extended"
                            size="large"
                        />
                    </div>
                </section>
            ) : (
                <PowerBtn
                    isOn={on}
                    loading={loading}
                    error={error}
                    callback={() => {
                        if (on) {
                            if (isMaintenanceMonth)
                                return showToast(
                                    "Renove seu plano para desativar automaticamente a expiração das moedas dos seus clientes.",
                                    { type: "error", dur: 10000 }
                                );
                            setOpenModalDeactivate(true);
                            return null;
                        }

                        return setOpenModalActivate(true);
                    }}
                />
            )}
        </Fragment>
    );

    const offModalTxt = isPendingMode
        ? `<span>Tem certeza que deseja cancelar os <strong>${pendingModeData.pendingNewClientsCount} clientes</strong> com expiração pendente?</span>`
        : `<span>Tem certeza que deseja desativar o prazo de expiração de <strong>${daysCount} dias</strong>?</span>`;

    return (
        <section>
            <div className="animated fadeInUp">
                {showMainButton()}
                {Boolean(pendingModeData.clientsWithExpBalanceCount) &&
                    showExpiredCliTotal()}
                {on && (
                    <div className="animated fadeInUp">
                        <p className="mx-4 font-site text-em-1 font-weight-bold text-grey text-left">
                            {pickDetailTxt({ daysCount, isMaintenanceMonth })}
                            <br />
                            <br />
                            Expiração foi ativada:{" "}
                            {activationDate ? fromNow(activationDate) : "..."}
                        </p>
                    </div>
                )}
            </div>
            {openModalDeactivate && !isMaintenanceMonth && (
                <AsyncModalYesNo
                    title="Confirmação"
                    subTitle={offModalTxt}
                    fullOpen={openModalDeactivate}
                    setFullOpen={setOpenModalDeactivate}
                    actionFunc={getModalCallback}
                />
            )}
            {openModalActivate && (
                <AsyncModalActivateExpiringCoins
                    fullOpen={openModalActivate}
                    setFullOpen={setOpenModalActivate}
                    actionFunc={getModalCallback}
                />
            )}
        </section>
    );
}

// HELPERS
function pickDeadlineTxt(daysCount) {
    if (!daysCount) return "";
    if (daysCount === 1) return "2 dias";
    if (daysCount === 30) return "30 dias (1 mês)";
    if (daysCount === 60) return "60 dias (2 meses)";
    if (daysCount === 90) return "90 dias (3 meses)";
    if (daysCount === 120) return "120 dias (4 meses)";
    if (daysCount === 150) return "150 dias (5 meses)";
    if (daysCount === 180) return "180 dias (6 meses)";

    return "";
}

function pickDetailTxt({ daysCount, isMaintenanceMonth }) {
    if (isMaintenanceMonth)
        return parse(
            `Mês de manutenção. Todas as moedas dos seus clientes expiram em <span class="text-normal font-weight-bold text-purple text-center">30 dias (1 mês)</span>, contando a partir da data do término do seu plano.<br /><br />Vale notar que seus clientes já cadastrados continuam usando suas moedas e seu negócio continua usando todas as funcionalidades com exceção a de cadastro de clientes.<br /><br />Renove seu plano para desativar a expiração automaticamente e cadastrar novos clientes.`
        );

    const days = pickDeadlineTxt(daysCount);

    return parse(
        `<span>Moedas de cada cliente expiram no prazo <span class="text-normal font-weight-bold text-purple text-center">${days}</span>.<br /><br />Para novos clientes, começa a contar a partir da data de cadastro. Para clientes que já foram cadastrados, conta a partir da data de ativação.`
    );
}
// END HELPERS
