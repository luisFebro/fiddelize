import ExtraServiceCard from "./ExtraServiceCard";
// import getSersfdvices from "../gedsatServices";
// getServfdsfdsices("pro", { plan: "bronze" })

export default function ExtraServicesGallery({ handleItem, period }) {
    const list = [1].map((service) => {
        const serviceData = {
            serviceName: "Menu Digital", // service.name,
            servicePrice: 0, // service.price[period],
            serviceDesc:
                "Ofereça Menu Digital para clientes com Qr Code. Agilize seu fluxo de compra.", // service.cardDesc,
            servicePage: null, // service.proPage,
            serviceIcon: "/img/pro-features/digital-menu/digital-menu.svg", // service.customIcon,
            period,
        };

        return (
            <ExtraServiceCard
                key={service.name}
                data={serviceData}
                handleItem={handleItem}
            />
        );
    });

    return (
        <section className="my-5 text-purple">
            <p className="mx-3 text-subtitle font-weight-bold text-purple text-center">
                Vitrine de Serviços
                <span className="d-block text-normal text-purple text-center">
                    Descubra mais soluções de experiência de compra
                </span>
            </p>
            <section className="container">
                <div className="row">{list}</div>
            </section>
        </section>
    );
}

/*
 */
