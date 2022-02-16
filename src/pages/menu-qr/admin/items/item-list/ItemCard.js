import { forwardRef, useEffect, useState, Fragment } from "react";
import convertToReal from "utils/numbers/convertToReal";
import EditButton from "components/buttons/EditButton";
import DeleteButton from "components/buttons/DeleteButton";
import useContext from "context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Checkbox from "@material-ui/core/Checkbox";
import ModalFullContent from "components/modals/ModalFullContent";
import showToast from "components/toasts";
import { Load } from "components/code-splitting/LoadableComp";
// import showToast from "components/toasts";

const AsyncAddItemContent = Load({
    loader: () =>
        import(
            "pages/menu-qr/admin/items/item-handler/AddItemContent.js" /* webpackChunkName: "add-item-content-lazy" */
        ),
});

const AsyncMinusPlusBtns = Load({
    loading: false,
    loader: () =>
        import(
            "./MinusPlusBtns" /* webpackChunkName: "minus-plus-btns-lazy" */
        ),
});
//

const truncate = (name, leng) => window.Helper.truncate(name, leng);
const isSmall = window.Helper.isSmallScreen();
// https://stackoverflow.com/questions/6139225/how-to-detect-a-long-touch-pressure-with-javascript-for-android-and-iphone
function onLongPress(elementId, callback) {
    let timer;
    const sec = 1000;

    const element = document.getElementById(elementId);
    if (isSmall) {
        element.addEventListener("touchstart", () => {
            timer = setTimeout(() => {
                callback();
                timer = null;
            }, sec);
        });
    } else {
        element.addEventListener("mousedown", () => {
            timer = setTimeout(() => {
                callback();
                timer = null;
            }, sec);
        });
    }

    function cancel() {
        clearTimeout(timer);
    }

    if (!isSmall) element.addEventListener("mouseup", cancel);
    else {
        element.addEventListener("touchend", cancel);
        element.addEventListener("touchmove", cancel);
    }
}

function ItemCard(
    {
        isCustomerCatalog,
        selectedCategory,
        isAddCategory = true,
        data,
        setDataList,
    },
    ref
) {
    const [fullOpen, setFullOpen] = useState(false);
    const [selected, setSelected] = useState(false);
    const { category, itemId, img, adName, price, isHidden = true } = data;
    const [btnsData, setBtnsData] = useState({
        qtt: 0,
    });
    const { qtt } = btnsData;

    const { itemData } = useContext();
    const handleItem = itemData && itemData.handleItem;

    const checkAlreadySelected = isAddCategory && selectedCategory === category;

    const updateList = (options = {}) => {
        const { passAlreadySelected, clicked } = options;

        if (
            !passAlreadySelected &&
            checkAlreadySelected &&
            category === "_general"
        )
            return showToast(
                "Categoria gerais é a opção padrão. Items nesta categoria só podem ser movidos para outras categorias"
            );
        setDataList((prev) => {
            // handle default list if unchecked for already selected item
            let newGeneralList = [];
            if (clicked) {
                const priorGeneralList = prev.generalList;
                const needGeneral = clicked && selected; // && alreadySelected; // clicked and still selected before unclicked
                newGeneralList = needGeneral
                    ? [...priorGeneralList, itemId]
                    : priorGeneralList.filter((currId) => currId !== itemId);
            }

            const foundItemAlready =
                prev && prev.selectionList.includes(itemId);

            const addSelectionList = () => [...prev.selectionList, itemId];
            const removeSelectionList = () =>
                prev.selectionList.filter((currId) => currId !== itemId);

            // make sure the already selected is added and only once
            if (passAlreadySelected && checkAlreadySelected) {
                setSelected(true);
                return {
                    ...prev,
                    selectionList: foundItemAlready
                        ? prev.selectionList
                        : addSelectionList(),
                    generalList: newGeneralList,
                };
            } else {
                setSelected((prevSele) => !prevSele);
            }

            if (foundItemAlready)
                return {
                    ...prev,
                    selectionList: removeSelectionList(),
                    generalList: newGeneralList,
                };
            return {
                ...prev,
                selectionList: addSelectionList(),
                generalList: newGeneralList,
            };
        });
    };

    useEffect(() => {
        if (checkAlreadySelected) updateList({ passAlreadySelected: true });
    }, [checkAlreadySelected]);

    useEffect(() => {
        if (isAddCategory) return;
        onLongPress(itemId, () => updateList());
    }, [isAddCategory]);

    const showSelectedItemCheckIcon = () => (
        <div
            className="position-absolute"
            style={{
                bottom: -10,
                left: -5,
            }}
        >
            <FontAwesomeIcon
                icon="check-circle"
                style={{
                    fontSize: 25,
                    color: "green",
                    border: "solid white 2px",
                    background: "var(--mainWhite)",
                }}
                className="animated rubberBand"
            />
        </div>
    );

    const showCheckBox = () => (
        <Checkbox
            checked={selected}
            onClick={(e) => {
                e.stopPropagation();
                updateList({ clicked: true });
            }}
            onChange={null}
            color="primary"
            style={{ color: "var(--mainWhite)" }}
        />
    );

    const showCategoryBadge = () => (
        <div
            className="position-absolute font-site"
            style={{
                bottom: -40,
                right: 50,
            }}
        >
            <div className="d-flex">
                <div className="category-badge">
                    <p className="text-nowrap text-shadow">
                        {truncate(
                            category === "_general" ? "gerais" : category,
                            10
                        )}
                    </p>
                </div>
                <div className="mr-1 d-none">
                    <DeleteButton onClick={null} />
                </div>
            </div>
            <style jsx>
                {`
                    .category-badge {
                        padding: 0px;
                    }

                    .category-badge p {
                        font-size: 14px;
                        padding: 2px;
                    }
                `}
            </style>
        </div>
    );

    const handlePrice = () => (
        <Fragment>
            {isCustomerCatalog ? (
                <p className="position-relative d-table text-normal text-shadow text-em-1-3 text-pill text-nowrap">
                    R${" "}
                    {convertToReal(qtt ? price * qtt : price, {
                        needFraction: true,
                    })}{" "}
                    {qtt > 1 ? (
                        <span className="text-em-0-7 d-block-inline">
                            {" "}
                            &gt; R$ {convertToReal(price)} uni.
                        </span>
                    ) : (
                        ""
                    )}
                </p>
            ) : (
                <p className="d-table text-normal text-shadow text-em-1-3 text-pill text-nowrap">
                    R$ {convertToReal(price, { needFraction: true })}
                </p>
            )}
        </Fragment>
    );

    return (
        <section
            ref={ref}
            className="item-card--root mt-3 text-white position-relative"
            id={itemId}
            style={{
                cursor: "pointer",
            }}
            onClick={() => isAddCategory && updateList()}
        >
            {isAddCategory && showCategoryBadge()}
            <div className="d-flex container align-items-center">
                {isAddCategory && showCheckBox()}
                <div
                    className="img-container"
                    style={{
                        opacity: isHidden ? 0.5 : 1,
                    }}
                >
                    <img width={100} height={100} src={img} alt={adName} />
                </div>
                <div className="text-left ml-3 text-normal">
                    <p
                        className="mx-2 mb-1 text-em-0-9 line-height-25"
                        style={{
                            minHeight: 30,
                        }}
                    >
                        {truncate(adName, 60)}
                    </p>
                    {handlePrice()}
                </div>
            </div>
            {!isAddCategory && (
                <Fragment>
                    {isCustomerCatalog ? (
                        <div
                            className="position-absolute text-white"
                            style={{ bottom: -18, right: 10 }}
                        >
                            <AsyncMinusPlusBtns
                                handleItem={handleItem}
                                qtt={qtt}
                                setData={setBtnsData}
                                card={data}
                            />
                        </div>
                    ) : (
                        <div
                            className="position-absolute"
                            style={{ bottom: 10, right: 10 }}
                        >
                            <EditButton
                                zIndex={1}
                                onClick={() => setFullOpen(true)}
                            />
                        </div>
                    )}
                </Fragment>
            )}
            {selected && !isAddCategory && showSelectedItemCheckIcon()}
            {fullOpen && (
                <ModalFullContent
                    contentComp={
                        <AsyncAddItemContent
                            card={data}
                            isEditBtn
                            handleFullClose={() => setFullOpen(false)}
                        />
                    }
                    fullOpen={fullOpen}
                    setFullOpen={setFullOpen}
                    backgroundColor="var(--themePDark)"
                />
            )}
            <style jsx>
                {`
                    .item-card--root {
                        background: var(--themePDark);
                        border-radius: 15px;
                    }

                    .item-card--root .container {
                        padding: 10px 0px;
                    }

                    .item-card--root .img-container {
                        padding: 0 10px;
                    }
                `}
            </style>
        </section>
    );
}

export default forwardRef(ItemCard);
