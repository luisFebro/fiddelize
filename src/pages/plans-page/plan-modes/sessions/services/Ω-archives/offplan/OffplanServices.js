// import { Fragment, useState, useEffect, useRef } from "react";
// import CarouselCard from "../../../../../../components/carousels/CarouselCard";
// // import getdsaServices from "../getSdsadervices";
// import OffplanBtn from "./offplan-btn/OffplanBtn";
// import CheckBoxForm from "../../../../../../components/CheckBoxForm";
// import convertToReal from "../../../../../../utils/numbers/convertToReal";

// const getStyles = () => ({
//     priceBadge: {
//         borderRadius: "30px",
//         padding: "4px 40px 4px 8px",
//         background: "var(--mainDark)",
//         color: "#fff",
//         textAlign: "center",
//         display: "table",
//         zIndex: 20,
//     },
//     discountBadge: {
//         right: 25,
//         borderRadius: "30px",
//         padding: "4px 8px",
//         backgroundColor: "var(--mainWhite)",
//         textAlign: "center",
//         display: "table",
//         zIndex: 30,
//     },
//     checkbox: {
//         top: -5,
//         right: -15,
//         zIndex: 10,
//     },
// });

// function getDiscount(normalPrice, options = {}) {
//     const { perc = 0.5 } = options;

//     const discount = perc * normalPrice;

//     const finalValue = normalPrice - discount;

//     return finalValue;
// }

// const getGroupServices = (selectedServices) => {
//     let groupServices = {};
//     let groupPrice = 0;
//     const map = selectedServices.forEach((each) => {
//         const servKey = Object.keys(each);
//         const currObj = each[servKey];

//         groupPrice += currObj ? currObj.price : 0;
//         groupServices = { ...groupServices, ...each };
//     });

//     return { groupPrice, groupServices };
// };

// const CardList = ({ data, handleNewOrder, period, plan }) => {
//     const [currService, setCurrService] = useState("");
//     const [isChecked, setIsChecked] = useState(false);

//     const selectedServices = useRef(new Map()).current;
//     useEffect(() => {
//         if (!selectedServices.has(currService) && isChecked) {
//             // const targetService = getSdsadsaervices("offplan").find(
//                 (serv) => serv.title === currService
//             );

//             if (targetService) {
//                 let servicePrice = targetService[plan].price[period];
//                 servicePrice = getDiscount(servicePrice);
//                 const serviceObj = {
//                     amount: 1,
//                     price: servicePrice,
//                     isPreSale: servicePrice,
//                 };

//                 selectedServices.set(currService, {
//                     [currService]: serviceObj,
//                 });

//                 const { groupPrice, groupServices } = getGroupServices(
//                     selectedServices
//                 );
//                 handleNewOrder(currService, {
//                     orderGroup: groupServices,
//                     orderGroupPrice: groupPrice,
//                 });
//             }
//         }
//     }, [isChecked, currService]);

//     const handleUncheck = (deleteThisServ) => {
//         setIsChecked(false);
//         selectedServices.delete(deleteThisServ); // deleteThisServ, { amount: 0, price: 0 }

//         handleNewOrder(currService, { removeOrderGroup: deleteThisServ }); // orderGroup: groupServices,
//     };

//     const handleCheck = (status, serviceName) => {
//         setIsChecked(status);
//         setCurrService(serviceName);
//     };

//     const styles = getStyles();

//     return (
//         <Fragment>
//             {getServices("offplan").map((card) => {
//                 const normalPrice = card[plan].price[period];
//                 const discountPrice = convertToReal(getDiscount(normalPrice));

//                 const modalData = {
//                     title: card.title,
//                     img: card.img,
//                     callback: handleCheck,
//                     feature: card.proPage,
//                     normalPrice,
//                     discountPrice,
//                 };

//                 const showImgDesc = () => (
//                     <section className="my-2">
//                         <img
//                             className="img-fluid"
//                             width={100}
//                             src={card.img}
//                             alt="serviço novidade"
//                         />
//                         <p className="mt-2 text-break text-light-grey text-left text-em-1-2 main-font font-weight-bold">
//                             {card.desc}
//                         </p>
//                     </section>
//                 );

//                 const showPrice = () =>
//                     selectedServices.has(card.title) && (
//                         <section className="d-flex justify-content-center position-relative">
//                             <section
//                                 className="position-absolute"
//                                 style={styles.checkbox}
//                             >
//                                 <CheckBoxForm
//                                     defaultState={isChecked && true}
//                                     data={card.title}
//                                     color="#a3ffa3" // light green
//                                     onClick={() => handleUncheck(card.title)}
//                                 />
//                             </section>
//                             <div
//                                 className="font-weight-bold text-normal"
//                                 style={styles.priceBadge}
//                             >
//                                 R$ {discountPrice}
//                             </div>
//                             <div
//                                 className="position-relative"
//                                 style={styles.discountBadge}
//                             >
//                                 <span
//                                     className="font-weight-bold text-grey"
//                                     style={{ textDecoration: "line-through" }}
//                                 >
//                                     R$ {normalPrice}
//                                 </span>
//                             </div>
//                         </section>
//                     );

//                 return (
//                     <section
//                         key={card.title}
//                         className="carousel-cell no-outline"
//                     >
//                         <p className="my-3 text-grey text-subtitle text-center font-weight-bold">
//                             {card.title}
//                         </p>
//                         {showImgDesc()}
//                         {showPrice()}
//                         {!selectedServices.has(card.title) && (
//                             <section className="my-1 container-center">
//                                 <OffplanBtn modalData={modalData} />
//                             </section>
//                         )}
//                     </section>
//                 );
//             })}
//         </Fragment>
//     );
// };

// export default function OffplanServices({ handleNewOrder, period, plan }) {
//     const data = getdadsaServices("offplan");

//     const ThisCardList = (
//         <CardList
//             data={data}
//             period={period}
//             handleNewOrder={handleNewOrder}
//             plan={plan}
//         />
//     );

//     return (
//         <section
//             className="pb-2 position-relative theme-p"
//             style={{ top: -140 }}
//         >
//             <h2 className="py-3 text-subtitle font-weight-bold text-white mx-3">
//                 Serviços em pré-venda
//                 <span className="d-block text-normal">
//                     Seja um dos primeiros fiddelizadores a investir e ganhe{" "}
//                     <strong>desconto de 50% fixo!</strong>
//                 </span>
//             </h2>
//             {period === "yearly" ? (
//                 <CarouselCard CardList={ThisCardList} />
//             ) : (
//                 <p className="mx-3 text-subtitle text-white font-weight-bold">
//                     Disponível apenas para período anual.
//                 </p>
//             )}
//         </section>
//     );
// }
