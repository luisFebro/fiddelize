import { useState, useEffect, Fragment } from "react";
import getAPI, { readMainItemList } from "api";
import EditButton from "components/buttons/EditButton";
import Card from "@material-ui/core/Card";
import convertToReal from "utils/numbers/convertToReal";
import Spinner from "components/loadingIndicators/Spinner";
import useContext from "context";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import RadiusBtn from "components/buttons/RadiusBtn";
import { updateHideItems } from "pages/menu-qr/admin/items/item-list/HideConfirmBtn";
import NewItemForm from "./items/NewItemForm";
import ImgHandler from "./img/ImgHandler";

export default function AddItemContent({
    card,
    isEditBtn,
    itemSearch,
    handleFullClose = () => null,
}) {
    const [mode, setMode] = useState("main"); // "show"
    const { adminId, isAdmin, updateItem } = useContext();

    const isShowItem = Boolean(itemSearch);

    const [data, setData] = useState({
        _id: null,
        itemId: null,
        img: null,
        adName: null,
        price: null,
        isHidden: card && card.isHidden,
        category: null,
        errorAdName: false,
        errorPrice: false,
        finishedUpload: false,
    });
    const { itemId, img, adName, price, category, isHidden } = data;

    const [loadingShowItem, setLoadingShowItem] = useState(false);

    useEffect(() => {
        if (isShowItem) setMode("show");
    }, [isShowItem]);

    const handleCardData = (thisCard) =>
        setData((prev) => ({
            ...prev,
            _id: thisCard._id,
            category: thisCard.category,
            itemId: thisCard.itemId,
            img: thisCard.img,
            adName: thisCard.adName,
            price: thisCard.price && thisCard.price.toFixed(2),
            isHidden: thisCard.isHidden,
        }));

    useEffect(() => {
        if (!itemSearch) return;

        setLoadingShowItem(true);

        const params = {
            // userId, // for auth
            adminId,
            isAdmin: isAdmin ? "1" : undefined,
            search: itemSearch,
            skip: 0,
            limit: 1,
            needAllCategories: false,
        };

        getAPI({
            method: "get",
            url: readMainItemList(),
            params,
        })
            .then((res) => {
                const dataRes = res.list && res.list[0];
                if (dataRes) handleCardData(dataRes);
                setLoadingShowItem(false);
            })
            .catch(() => setLoadingShowItem(false));
    }, [itemSearch]);

    // handle card data from ItemCardAdmin for edit
    useEffect(() => {
        if (!card) return;
        handleCardData(card);
    }, [card]);

    const handleTitle = () => {
        if (isShowItem) return "Detalhes do Item";
        return isEditBtn ? "Edição de Item" : "Adicione Novo Item";
    };
    const showTitle = () => (
        <h2 className="my-4 text-subtitle text-white text-shadow text-center font-weight-bold">
            {handleTitle()}
        </h2>
    );

    const showData = () => (
        <section
            style={{
                overflowY: "scroll",
            }}
        >
            <Card
                className="mb-3"
                style={{
                    margin: "auto",
                    boxShadow: "0 31px 120px -6px rgba(0, 0, 0, 0.35)",
                    width: "100%",
                    // maxWidth: isSmall ? "" : 360,
                }}
            >
                <p className="mt-3 text-center text-purple text-subtitle font-weight-bold mx-3">
                    Informações
                </p>
                <main className="mx-3 text-p text-normal position-relative">
                    <div className="mt-3">
                        <span className="font-weight-bold">
                            Nome Divulgação:
                        </span>
                        <p className="font-italic">{adName}</p>
                    </div>
                    <div className="mt-3">
                        <span className="font-weight-bold">Preço:</span>
                        <p className="font-italic">
                            R$ {convertToReal(price, { needFraction: true })}
                        </p>
                    </div>
                    <div className="mt-3">
                        <span className="font-weight-bold">Categoria:</span>
                        <p className="font-italic">
                            {category === "_general" ? "gerais" : category}
                        </p>
                    </div>
                    <div className="d-flex justify-content-end mr-3">
                        <EditButton
                            position="relative"
                            bottom={0}
                            right={0}
                            transform="scale(0.9)"
                            onClick={() => {
                                setMode("main");
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: 50 }} />
                </main>
            </Card>
        </section>
    );

    const showAdminVisibilityItemInfo = () => (
        <section className="hidden-item-area">
            <div className="py-2 mx-2 d-flex align-items-center justify-content-center">
                <div className="mr-2">
                    <VisibilityOffIcon
                        style={{ color: "var(--mainWhite)", fontSize: 30 }}
                    />
                </div>
                <span className="font-site text-em-1 text-shadow text-white">
                    Este item está escondido e não aparece para seus clientes no
                    menu digital.
                </span>
                <div className="container-center">
                    <RadiusBtn
                        position="relative"
                        backgroundColor="var(--incomeGreen)"
                        title="tornar disponível"
                        size="extra-small"
                        fontSize="15px"
                        onClick={async () => {
                            await updateHideItems({
                                updateItem,
                                bizId: adminId,
                                needHide: false,
                                selectionList: [itemId],
                            });
                        }}
                    />
                </div>
            </div>
            <style jsx>
                {`
                    .hidden-item-area {
                        background: grey;
                        min-height: 50px;
                    }
                `}
            </style>
        </section>
    );

    return (
        <section>
            {showTitle()}
            {loadingShowItem ? (
                <div className="my-5" style={{ minHeight: 150 }}>
                    <Spinner size="large" />
                </div>
            ) : (
                <Fragment>
                    <ImgHandler
                        setData={setData}
                        savedImg={img}
                        isShowItem={isShowItem}
                    />
                    {isHidden && showAdminVisibilityItemInfo()}
                </Fragment>
            )}
            {mode === "main" ? (
                <NewItemForm
                    setData={setData}
                    handleFullClose={handleFullClose}
                    data={data}
                    isEditBtn={isEditBtn}
                    isShowItem={isShowItem}
                />
            ) : (
                showData()
            )}
        </section>
    );
}
