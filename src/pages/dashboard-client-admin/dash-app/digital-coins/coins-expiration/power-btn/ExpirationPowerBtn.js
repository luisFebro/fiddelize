import { useState, useEffect } from "react";
import PowerBtn from "components/buttons/power-btn/PowerBtn";
import { Load } from "components/code-splitting/LoadableComp";
import { useReadUser, updateUser } from "api/frequent";
import showToast from "components/toasts";
import parse from "html-react-parser";
import useData, { useBizData } from "init";
import getAPI, { setExpiringCoinsToBase } from "api";
import { fromNow, addDays } from "utils/dates/dateFns";

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
        activationDate: new Date(),
    });
    const [openModalDeactivate, setOpenModalDeactivate] = useState(false);
    const [openModalActivate, setOpenModalActivate] = useState(false);
    const { on, daysCount, activationDate, isMaintenanceMonth } = data;

    const { userId } = useData();
    const { bizName, bizLogo } = useBizData();

    const { data: dataUser, loading, error } = useReadUser(
        userId,
        "cliente-admin",
        "clientAdminData.expiringCoinsDeadline",
        {
            trigger: userId,
        }
    );

    useEffect(() => {
        if (!dataUser) return;

        const expiringCoinsDeadline =
            dataUser.clientAdminData &&
            dataUser.clientAdminData.expiringCoinsDeadline;

        if (expiringCoinsDeadline) {
            setData((prev) => ({
                ...prev,
                on: expiringCoinsDeadline.on,
                daysCount: expiringCoinsDeadline.daysCount,
                activationDate: expiringCoinsDeadline.activationDate,
                isMaintenanceMonth: expiringCoinsDeadline.isMaintenanceMonth,
            }));
        }
    }, [dataUser]);

    const getModalCallback = async (activationData) => {
        setData((prev) => ({
            ...prev,
            on: !prev.on,
            daysCount: activationData ? activationData.pickedDaysCount : 0,
        }));

        // DB HANDLING
        const isDeactivated = Boolean(!activationData);
        const role = "cliente-admin";
        const body = {
            "clientAdminData.expiringCoinsDeadline.on": !isDeactivated,
            "clientAdminData.expiringCoinsDeadline.activationDate": isDeactivated
                ? null
                : new Date(),
            "clientAdminData.expiringCoinsDeadline.expirationDate": isDeactivated
                ? null
                : addDays(new Date(), activationData.pickedDaysCount),
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

    return (
        <section>
            <div className="animated fadeInUp">
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
                {on && (
                    <div className="animated fadeInUp">
                        <p className="mx-4 font-site text-em-1 font-weight-bold text-grey text-left">
                            {pickDetailTxt({ daysCount, isMaintenanceMonth })}
                            <br />
                            <br />
                            Expiração foi ativada: {fromNow(activationDate)}
                        </p>
                    </div>
                )}
            </div>
            {openModalDeactivate && !isMaintenanceMonth && (
                <AsyncModalYesNo
                    title="Confirmação"
                    subTitle={`<span>Tem certeza que deseja desativar o prazo de expiração de <strong>${daysCount} dias</strong>?</span>`}
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
