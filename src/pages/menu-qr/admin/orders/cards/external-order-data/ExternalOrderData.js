import Card from "@material-ui/core/Card";
import HomeIcon from "@material-ui/icons/Home";
import PersonIcon from "@material-ui/icons/Person";
import PhoneIphoneIcon from "@material-ui/icons/PhoneIphone";

export default function ExternalOrderData({ dataOnline }) {
    const { customerName, customerPhone, customerAddress } = dataOnline;
    const isDelivery = Boolean(customerAddress);

    return (
        <section className="my-5">
            <Card
                className="mb-3"
                style={{
                    margin: "auto",
                    boxShadow: "0 31px 120px -6px rgba(0, 0, 0, 0.35)",
                    width: "90%",
                    // maxWidth: isSmall ? "" : 360,
                }}
            >
                <p className="mt-3 text-center text-purple text-subtitle font-weight-bold mx-3">
                    Info para {isDelivery ? "entrega" : "busca pedido na loja"}
                </p>
                <main className="mx-3 text-p text-normal position-relative">
                    <div className="mt-3">
                        <PersonIcon /> Nome:
                        <p className="font-italic">{customerName}</p>
                    </div>
                    <div className="mt-3">
                        <PhoneIphoneIcon /> Celular/Whatsapp:
                        <p className="font-italic">{customerPhone}</p>
                    </div>
                    <div className="mt-3">
                        <HomeIcon /> Endereço:
                        <p className="font-italic">{customerAddress}</p>
                    </div>
                    {/*{showCTA()}*/}
                    <div style={{ marginBottom: 50 }} />
                </main>
            </Card>
        </section>
    );
}
