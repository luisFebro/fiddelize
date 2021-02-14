import RegisteredUsers from "./RegisteredUsers";
import DashSectionTitle from "../../DashSectionTitle";

export default function DashUsers() {
    return (
        <div>
            <DashSectionTitle title="Dados dos Usuários Cadastrados" />
            <RegisteredUsers />
        </div>
    );
}
