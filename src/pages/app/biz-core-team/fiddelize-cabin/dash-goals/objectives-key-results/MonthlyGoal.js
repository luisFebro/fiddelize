import { useState, Fragment } from "react";
import EditButton from "components/buttons/EditButton";
import NumberField from "components/fields/NumberField";
import RadiusBtn from "components/buttons/RadiusBtn";
import KeyResult from "./KeyResult";

export default function MonthlyGoal({
    goalKR,
    currKR,
    goalDesc = "novos clientes",
    updateGoal,
}) {
    const [edit, setEdit] = useState(false);
    const [data, setData] = useState({
        newGoal: null,
    });
    const { newGoal } = data;

    const handleEdit = () => {
        setEdit(true);
    };

    const handleSave = async () => {
        await updateGoal("newCustomers", newGoal);

        setEdit(false);
        return null;
    };

    const showGoal = () => (
        <Fragment>
            {edit ? (
                <Fragment>
                    <p className="mt-5 text-center font-weight-bold">
                        Qual nova meta de {goalDesc}?
                    </p>
                    <NumberField
                        type="integer"
                        name="newGoal"
                        textAlign="text-left"
                        size="large"
                        width={200}
                        placeholder={0}
                        value={newGoal}
                        onChangeCallback={setData}
                    />
                    <div className="mt-3">
                        <RadiusBtn
                            position="relative"
                            backgroundColor="var(--themeSDark)"
                            title="salvar"
                            size="medium"
                            fontSize="15px"
                            onClick={handleSave}
                        />
                    </div>
                </Fragment>
            ) : (
                <h3
                    className="text-normal text-pill text-center"
                    style={{
                        padding: "10px 15px",
                        bottom: -20,
                    }}
                >
                    atingir
                    <br />
                    <strong>
                        {goalKR} {goalDesc}
                    </strong>
                </h3>
            )}
        </Fragment>
    );

    return (
        <section className="text-purple">
            <main className="text-subtitle font-weight-bold">
                <h2
                    className="text-purple text-subtitle font-weight-bold text-center"
                    style={{ lineHeight: "30px" }}
                >
                    Resultado-Chave
                    <br />
                    Mensal Atual:
                </h2>
                <div className="position-relative">
                    {showGoal()}
                    {!edit && (
                        <div
                            className="position-absolute"
                            style={{
                                top: "-25px",
                                right: "-15px",
                            }}
                        >
                            <EditButton onClick={handleEdit} zIndex=" " />
                        </div>
                    )}
                </div>
            </main>
            <KeyResult goalKR={goalKR} currKR={currKR} />
        </section>
    );
}
