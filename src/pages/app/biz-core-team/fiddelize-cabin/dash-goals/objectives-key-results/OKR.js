import useData from "init";
import { updateUser } from "api/frequent";
import showToast from "components/toasts";
import WeeklyGoal from "./WeeklyGoal";
import MonthlyGoal from "./MonthlyGoal";
import YearlyGoal from "./YearlyGoal";

export default function OKR({ weeklyData = {} }) {
    const proCustomersCount = weeklyData && weeklyData.proCustomersCount;
    const newCustomersCount = weeklyData && weeklyData.newCustomersCount;
    const allTimeAccountsCount = weeklyData && weeklyData.allTimeAccountsCount;

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

    const dataWeeklyGoal = {
        goalKR: proCustomersCount && proCustomersCount.goal,
        currKR: proCustomersCount && proCustomersCount.curr,
        goalDesc: "clientes pro",
        updateGoal,
        growthRate: weeklyData && weeklyData.growthRate,
    };

    return (
        <section className="mt-5 mx-2">
            <WeeklyGoal {...dataWeeklyGoal} />
            <hr className="lazer-purple" />
            <MonthlyGoal
                goalKR={newCustomersCount && newCustomersCount.goal}
                currKR={newCustomersCount && newCustomersCount.curr}
                goalDesc="novos cliente-admins"
                updateGoal={updateGoal}
            />
            <hr className="lazer-purple" />
            <YearlyGoal
                goalKR={allTimeAccountsCount && allTimeAccountsCount.goal}
                currKR={allTimeAccountsCount && allTimeAccountsCount.curr}
                goalDesc="apps instalados"
            />
            <div
                style={{
                    marginBottom: 100,
                }}
            />
        </section>
    );
}
