import { Fragment } from "react";
import DashSectionTitle from "../../DashSectionTitle";
import UpdateConfigForm from "./UpdateConfigForm";

export default function DashSetting() {
    return (
        <Fragment>
            <div>
                <DashSectionTitle title="Configurações Gerais do Site" />
                <UpdateConfigForm />
            </div>
        </Fragment>
    );
}
