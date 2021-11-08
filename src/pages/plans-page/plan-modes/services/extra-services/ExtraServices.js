import { Fragment } from "react";
import ServicesGallery from "./gallery/ServicesGallery";
import AddSMS from "./AddSMS";

export default function ExtraServices({ orderList, handleItem, period }) {
    return (
        <Fragment>
            <h2 className="mx-3 text-subtitle font-weight-bold text-purple text-center">
                <span className="text-pill">Serviços Extras</span>
                <p className="mt-3 text-normal font-weight-bold">
                    Invista e use quando precisar, sem prazo para expirar.
                </p>
            </h2>
            <AddSMS orderList={orderList} handleItem={handleItem} top={-80} />
            <div style={{ marginBottom: 100 }} />

            <ServicesGallery handleItem={handleItem} period={period} />
        </Fragment>
    );
}
