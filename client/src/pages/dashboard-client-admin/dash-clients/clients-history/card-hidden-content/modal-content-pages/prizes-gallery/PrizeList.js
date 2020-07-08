import React, { useEffect, useState } from 'react';
import { readPrizes } from '../../../../../../../redux/actions/userActions';
import Trophy from './Trophy';

let stop;
export default function PrizeList({ userId }) {
    const [list, setList] = useState([]);

    useEffect(() => {
        if(userId && !stop) {
            readPrizes(userId)
            .then(res => {
                if(res.status !== 200) return console.log("Smt wrong with prizeList")
                setList(res.data);
            })
            stop = true;
        }
    }, [userId])

    return (
        <section className="prize-list--root">
            {JSON.stringify(list)}
            <Trophy type="custom" />
            <Trophy type="custom" />
            <Trophy type="placeholder"/>
            <Trophy type="placeholder"/>
        </section>
    );
}

PrizeList.whyDidYouRender = true;