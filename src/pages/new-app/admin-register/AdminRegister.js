import useScrollUp from "hooks/scroll/useScrollUp";
import RegisterClientAdmin from "components/auth/RegisterClientAdmin";
import RadiusBtn from "components/buttons/RadiusBtn";
import useData from "init";
import getVar from "init/var";
import { useNeedRedirectPage } from "../helpers/handleRedirectPages";

export default function AdminRegister({ history }) {
    useScrollUp();
    useNeedRedirectPage({ history, priorPageId: "doneSSRatingIcon" });

    const [clientAdminData] = useData(["clientAdminData"], "pre_register");

    const bizName = clientAdminData && clientAdminData.bizName;
    const logo = clientAdminData && clientAdminData.bizLogo;

    const showTitle = () => (
        <div className="text-center text-white my-4">
            <h1 className="text-title">Novo Clube</h1>
            <p className="text-white text-normal mx-3 mb-5">
                Antes de baixar seu app admin, finalize cadastrando sua conta
            </p>
        </div>
    );

    const showAppInstantOption = () => (
        <section className="my-5 text-white container-center-col text-small font-weight-bold">
            <p className="mb-2">Já possui uma conta da Fiddelize? </p>
            <RadiusBtn
                title="Cadastre via App Instantâneo"
                onClick={async () => {
                    const dataCliAdmin = await getVar(
                        "clientAdminData",
                        "pre_register"
                    );
                    const {
                        themeBackColor,
                        themePColor,
                        themeSColor,
                    } = dataCliAdmin;
                    window.location.href = `/baixe-app/admin?negocio=${bizName}&logo=${logo}&admin=1&bc=${
                        themeBackColor || "default"
                    }&pc=${themePColor || "default"}&sc=${
                        themeSColor || "default"
                    }&isFromSelfServ=1`;
                }}
            />
        </section>
    );

    return (
        <section>
            {showTitle()}
            <RegisterClientAdmin logo={logo} />
            {showAppInstantOption()}
        </section>
    );
}
