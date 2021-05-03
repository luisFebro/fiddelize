import { useState, useRef, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { setVar } from "init/var";
import PasswordCircleFields from "components/fields/PasswordCircleFields.js";
import NumericKeyboard from "components/keyboards/NumericKeyboard";
import getAPI, { createPassword } from "utils/promises/getAPI";
import getFirstName from "utils/string/getFirstName";
import showToast from "components/toasts";

export default withRouter(AccessPassCreation);

function AccessPassCreation({ isBizTeam, userName, userId, history }) {
    const [display, setDisplay] = useState("");

    const [data, setData] = useState({
        newPswd: null,
        newPswd2: null,
        currPswd: 1, // 1 or 2
    });
    const { newPswd, newPswd2, currPswd } = data;

    const showNextField = () => {
        let counter = display.length;
        const currTypingField = document.querySelector(
            `.pass-block-${++counter}`
        );
        if (currTypingField) currTypingField.classList.toggle("d-block");
    };

    const undoClick = () => {
        const counter = display.length;
        const currTypingField = document.querySelector(
            `.pass-block-${counter}`
        );
        if (currTypingField) currTypingField.classList.toggle("d-block");
    };

    const storedPswd = useRef(""); // not clear newPswd after switching to newPswd2
    const restartFields = (restartAll) => {
        setDisplay("");

        const fields = document.querySelectorAll(".pass-circle");
        if (fields) {
            fields.forEach((f) => {
                f.classList.remove("d-block");
            });
        }

        if (restartAll) {
            storedPswd.current = "";
            setData({ currPswd: 1, newPswd: null, newPswd2: null });
        }
    };

    useEffect(() => {
        if (currPswd === 1) {
            if (display) {
                storedPswd.current = display;
            }
            setData((prev) => ({ ...prev, newPswd: storedPswd.current }));
        } else {
            setData((prev) => ({ ...prev, newPswd2: display }));
        }

        const newPswdCond = currPswd === 2 && newPswd2 && newPswd2.length === 6;
        const completedFill =
            currPswd === 1 ? display && newPswd.length === 6 : newPswdCond;
        if (completedFill) {
            (async () => {
                const body = {
                    newPswd,
                    newPswd2,
                    userId,
                    role: isBizTeam ? "nucleo-equipe" : "cliente-admin",
                };

                newPswdCond && showToast("Criando...");
                // LESSON: do not destruct await with catch. otherwise when catch returns will throw an error of data's undefined.
                const finalRes = await getAPI({
                    method: "post",
                    url: createPassword(),
                    body,
                    needAuth: false,
                }).catch(({ error }) => {
                    restartFields(true);
                    showToast(
                        error || "Um problema aconteceu. Tente novamente",
                        { type: "error" }
                    );
                });

                if (finalRes) {
                    if (currPswd === 1) {
                        restartFields();
                        setData((prev) => ({ ...prev, currPswd: 2 }));
                    }

                    const { msg } = finalRes.data;
                    if (msg === "pass created") {
                        showToast("Senha criada!", { type: "success" });
                        setTimeout(() => {
                            if (isBizTeam) {
                                (async () => {
                                    await setVar({ donePswd: true });
                                    history.push(
                                        "/t/app/nucleo-equipe/cadastro/pagseguro"
                                    );
                                })();
                            } else {
                                showToast("Tudo pronto!", { dur: 4000 });
                                history.push("/mobile-app");
                            }
                        }, 2900);
                    }
                }
            })();
        }
    }, [currPswd, display, storedPswd, newPswd, newPswd2]);

    return (
        <section>
            <div className="my-4 mx-3">
                <p className="text-center font-weight-bold  text-subtitle text-white">
                    Crie senha de acesso
                </p>
                {currPswd === 2 && (
                    <p className="text-center font-weight-bold  text-normal text-white">
                        Digite novamente:
                    </p>
                )}
            </div>
            <PasswordCircleFields needDark={false} />
            <div className={`${currPswd === 2 ? "my-3" : "my-5"} mx-3`}>
                <p className="text-left text-small text-white">
                    - <strong>Guarde</strong> essa senha,{" "}
                    {getFirstName(userName)}.
                    <br />- Só lembrar que a senha não pode ser{" "}
                    <strong>sequencial ou repetida</strong>.
                </p>
            </div>
            <NumericKeyboard
                setDisplay={setDisplay}
                display={display}
                addCallback={showNextField}
                eraseCallback={undoClick}
                colorP="purple"
            />
        </section>
    );
}
