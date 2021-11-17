import useData, { useBizData } from "init";
import { updateUser } from "api/frequent";
import showToast from "components/toasts";
import MonthlyGoal from "./MonthlyGoal";
import WeeklyGoal from "./WeeklyGoal";

export default function OKR({ weeklyData = {}, monthlyData = {} }) {
    const proCustomersCount = weeklyData && weeklyData.proCustomersCount;
    const newCustomersCount =
        monthlyData &&
        monthlyData.freeCustomersCount + monthlyData.proCustomersCount;
    const { userId } = useData();
    const { kro } = useBizData();

    const updateGoal = (target = "pro", newValue) => {
        const dataUpdate = {
            [`bizTeamData.kro.${target}`]: newValue,
        };
        updateUser(userId, "nucleo-equipe", dataUpdate)
            .then(() => {
                showToast("Meta alterada!", { type: "success" });
            })
            .catch(() =>
                showToast("Ocorreu um erro ao atualizar meta", {
                    type: "error",
                })
            );
    };

    return (
        <section className="mt-5 mx-2">
            <MonthlyGoal
                goalKR={kro && kro.newCustomers}
                currKR={newCustomersCount}
                goalDesc="novos clientes"
                updateGoal={updateGoal}
            />
            <hr className="lazer-purple" />
            <WeeklyGoal
                goalKR={kro && kro.pro}
                currKR={proCustomersCount}
                goalDesc="clientes pro"
                updateGoal={updateGoal}
            />
        </section>
    );
}
