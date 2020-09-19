import React from "react";
import ButtonFab from "../../../components/buttons/material-ui/ButtonFab";
import ButtonMulti from "../../../components/buttons/material-ui/ButtonMulti";
import { Link } from "react-router-dom";
import { useStoreDispatch } from "easy-peasy";
import { setRun } from "../../../redux/actions/globalActions";
import { useClientAdmin } from "../../../hooks/useRoleData";

export default function PayArea({ handleCancel }) {
    const dispatch = useStoreDispatch();

    const { bizCodeName } = useClientAdmin();

    return (
        <section className="my-5">
            <p
                className="mb-5 text-center text-purple text-subtitle font-weight-bold"
                style={{ lineHeight: "35px" }}
            >
                Pronto para fazer
                <br />
                parte do <span className="text-pill">clube pro</span>
                <br />
                da Fiddelize?
            </p>
            <section className="container-center-col">
                <a
                    className="no-text-decoration"
                    href="https://www.pagseguro.com/something"
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    <ButtonFab
                        size="large"
                        title="VAMOS LÁ!"
                        position="relative"
                        onClick={() => handleCancel("noMsg")}
                        backgroundColor={"var(--themeSDark)"}
                        variant="extended"
                    />
                </a>
                <Link
                    to={`/${bizCodeName}/cliente-admin/painel-de-controle`}
                    onClick={() => setRun(dispatch, "goDash")}
                >
                    <ButtonMulti
                        title="VOLTAR MAIS TARDE"
                        onClick={null}
                        variant="link"
                        color="var(--themeP)"
                        underline={true}
                    />
                </Link>
            </section>
        </section>
    );
}
