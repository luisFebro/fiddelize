import { useState } from "react";
import CoreOptionsForm from "pages/dashboard-client-admin/dash-app/buy-games/discount-back/challenges-list/add-new-chall/CoreOptionsForm";

export default function DiscountBackPanel({ history }) {
    const [data, setData] = useState({
        perc: null,
        targetPoints: null,
        targetMoney: 0,
    });

    return (
        <section>
            <CoreOptionsForm
                isPlatform
                setData={setData}
                history={history}
                {...data}
            />
        </section>
    );
}
