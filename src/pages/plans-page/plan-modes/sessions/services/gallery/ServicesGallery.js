// import ServicesGalleryCard from "./ServicesGalleryCard";
// import getSersfdvices from "../gedsatServices";

export default function ServicesGallery({ handleItem, period }) {
    // const list = getServfdsfdsices("pro", { plan: "bronze" }).map((service) => {
    //     const serviceData = {
    //         serviceName: service.name,
    //         servicePrice: service.price[period],
    //         serviceDesc: service.cardDesc,
    //         servicePage: service.proPage,
    //         serviceIcon: service.customIcon,
    //         period,
    //     };

    //     return (
    //         <ServicesGalleryCard
    //             key={service.name}
    //             data={serviceData}
    //             handleItem={handleItem}
    //         />
    //     );
    // });

    return (
        <section className="my-5 text-purple">
            <p className="mx-3 text-subtitle font-weight-bold text-purple text-center">
                Vitrine de Serviços
                <span className="d-block text-normal text-purple text-center">
                    Descubra serviços extras para beneficiar seu negócio e a
                    clientela.
                </span>
            </p>
            <section className="container">
                <p className="my-5 text-grey text-normal text-center font-weight-bold">
                    Em breve!
                </p>
                {/*<div className="row">{list}</div>*/}
            </section>
        </section>
    );
}

/*
 */
