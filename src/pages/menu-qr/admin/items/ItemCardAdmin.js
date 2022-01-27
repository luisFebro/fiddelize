import convertToReal from "utils/numbers/convertToReal";
import EditButton from "components/buttons/EditButton";
// import showToast from "components/toasts";

const truncate = (name, leng) => window.Helper.truncate(name, leng);

export default function ItemCardAdmin({ card }) {
    const showImg = () => (
        <section className="mb-2 container-center">
            <img
                data-flickity-lazyload={card.img}
                className="carousel-cell-image"
                width="150px"
                height="150px"
                alt={card.adName}
            />
        </section>
    );

    const handleEdit = () => {
        //
    };

    return (
        <section key={card._id} className="carousel-cell no-outline">
            {showImg()}
            <section className="text-left">
                <p
                    className="mb-1 text-em-1-1"
                    style={{
                        minHeight: 50,
                    }}
                >
                    {truncate(card.adName, 40)}
                </p>
                <p className="d-table text-normal text-shadow text-em-1-3 text-pill text-nowrap">
                    R$ {convertToReal(card.price, { needFraction: true })}{" "}
                </p>
                <div
                    className="position-absolute"
                    style={{ bottom: 5, right: 5 }}
                >
                    <EditButton onClick={handleEdit} zIndex=" " />
                </div>
            </section>
        </section>
    );
}
