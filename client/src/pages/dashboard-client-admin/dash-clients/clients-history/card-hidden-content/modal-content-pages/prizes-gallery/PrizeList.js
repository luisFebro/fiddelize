import React, { useEffect, useState } from 'react';
import { readPrizes } from '../../../../../../../redux/actions/userActions';
import { useClientAdmin } from '../../../../../../../hooks/useRoleData';
import Trophy from './Trophy';

export default function PrizeList({ userId }) {
    const [list, setList] = useState([]);

    useEffect(() => {
        readPrizes(userId)
        .then(res => {
            if(res.status !== 200) return console.log("Smt wrong with prizeList")
            setList(res.data);
        })
    }, [userId])

    let rewardList = [
        {
            id: "5e8b0bfc8c616719b01abc9c",
            icon: "star",
            rewardScore: 100,
            rewardDesc: "corte unissex teste"
        },
        {
            id: "5e8b0bfc8c616719b01abc9c",
            icon: "star",
            rewardScore: 200,
            rewardDesc: "massagem teste"
        },
        {
            id: "5e8b0bfc8c616719b01abc9c",
            icon: "cart-plus",
            rewardScore: 300,
            rewardDesc: "massagem e hidratação teste"
        },

    ]
    const reversedRewardList = rewardList.reverse();
    // const { rewardList, arePrizesHidden } = useClientAdmin();
    const arePrizesHidden = false;
    const isProgressiveMode = rewardList.length > 1;

    const getData = (cliPrize, adminPrize) => {
        const { challengeN, isPrizeReceived, isPrizeConfirmed } = cliPrize;

        if(!adminPrize) {
            const lastAdminPrize = rewardList[rewardList.length - 1];
            adminPrize = lastAdminPrize;
        }

        const { icon, rewardDesc } = adminPrize;

        const data = {
            type: "custom",
            challN: challengeN,
            challIcon: icon,
            prizeDesc: rewardDesc,
            isConfirmed: isPrizeConfirmed,
            isDelivered: isPrizeReceived,
        };

        return data;
    }

    const dataMap = list && list.map((prize, ind) => {
        const { _id: prizeId } = prize;

        const data = getData(prize, reversedRewardList[ind]);
        console.log("data", data);

        return(
            <Trophy
                key={prizeId}
                data={data}
            />
        );
    })

    return (
        <section className="prize-list--root">
            {dataMap}
        </section>
    );
}

PrizeList.whyDidYouRender = true;