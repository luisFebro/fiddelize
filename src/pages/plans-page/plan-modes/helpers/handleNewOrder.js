// export default function handleNewOrder(serviceName, options = {}) {
//     const {
//         order,
//         orderGroup,
//         orderGroupPrice = 0,
//         removeOrderGroup,
//         setData,
//         onlyRes = false, //if need only the obj like using Novvos Clientes directly from client's history.
//     } = options;

//     const isFunc = typeof setData === "function";

//     const orderPrice = order ? order.price : orderGroupPrice;
//     let newTotal = orderPrice;

//     // for SMS logics
//     const needCurrRemoval = order && order.removeCurr;
//     needCurrRemoval && isFunc && setData({
//             ...data,
//             orders: { ...orders, [serviceName]: orders[serviceName] },
//         });

//         const handleOrderShape = () => {
//             if(onlyRes) return { [serviceName]: order };

//             if (removeOrderGroup) {
//                 const newOrder = orders;
//                 delete newOrder[removeOrderGroup];
//                 return { ...orders, ...newOrder };
//             }
//             return orderGroup
//                 ? { ...orders, ...orderGroup }
//                 : { ...orders, [serviceName]: order };
//         };
//         const ordersObj = handleOrderShape();

//         isFunc && setData({ ...data, orders: ordersObj });
//         if(onlyRes) return ordersObj;
//     };
// }
