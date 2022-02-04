import { useEffect } from "react";

/*
DEFINITIONS
item: each product, service or a plan data.
count: total of items in the order
amount: final price of all items in the order.
order: all items added

item example payload:
name: "Connecta Membros", (description of product)
count: Number(totalPackage),
amount: Number(inv),
*/

export function useOrderTotal({ orderCount, orderList = [], setData }) {
    useEffect(() => {
        const amount = orderList.reduce((acc, next) => acc + next.amount, 0);
        const count = orderList.reduce((acc, next) => acc + next.count, 0);

        setData((prev) => ({
            ...prev,
            orderCount: count,
            orderAmount: amount,
        }));

        // eslint-disable-next-line
    }, [orderList]);
}

// add new item or update current added item
export function updateItem(payload) {
    const { item, setData } = payload;

    setData((prev) => {
        const serviceName = item.name;
        const prevList = prev.orderList;

        // update item by removing any prior added item to insert new one
        const clearedList = prevList.filter(
            (priorItem) => priorItem.name !== serviceName
        );

        return {
            ...prev,
            orderList: [...clearedList, item],
            // currService: serviceName,
        };
    });
}

export function removeItem(payload) {
    const { itemName, setData } = payload;

    setData((prev) => {
        const prevList = prev.orderList;

        // same logic for updating above, but for removal purpose.
        const clearedList = prevList.filter(
            (priorItem) => priorItem.name !== itemName
        );

        return {
            ...prev,
            orderList: clearedList,
            // currService: itemName,
        };
    });
}
