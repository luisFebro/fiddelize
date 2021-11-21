import useData from "init";
import { updateUser } from "api/frequent";
import showToast from "components/toasts";
import MonthlyGoal from "./MonthlyGoal";
import WeeklyGoal from "./WeeklyGoal";

export default function OKR({ weeklyData = {} }) {
    const proCustomersCount = weeklyData && weeklyData.proCustomersCount;
    const newCustomersCount = weeklyData && weeklyData.newCustomersCount;

    const { userId } = useData();

    const updateGoal = (target = "pro", newValue) => {
        const dataUpdate = {
            [`bizTeamData.okr.${target}`]: newValue,
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
                goalKR={newCustomersCount && newCustomersCount.goal}
                currKR={newCustomersCount && newCustomersCount.curr}
                goalDesc="novos clientes"
                updateGoal={updateGoal}
            />
            <hr className="lazer-purple" />
            <WeeklyGoal
                goalKR={proCustomersCount && proCustomersCount.goal}
                currKR={proCustomersCount && proCustomersCount.curr}
                goalDesc="clientes pro"
                updateGoal={updateGoal}
                growthRate={weeklyData && weeklyData.growthRate}
            />
        </section>
    );
}
