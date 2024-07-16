import React, { useEffect, useState } from 'react';
import gift_1 from '../assets/gift_1.svg'
import gift_2 from '../assets/gift_2.svg'
import ref_coin_icon from '../assets/ref_coin_icon.svg'
import { IoCopyOutline } from "react-icons/io5";
import getRefs from '../api/getRefs';
import tg_user_id from '../constants/telegramUserId';

function Refs({ setPage }) {
    const [refs, setRefs] = useState(0)

    useEffect(() => {
        (async () => {
            let res = await getRefs(tg_user_id)
            setRefs(res.data.count)
        })()
    })
    const copyHandler = (text) => {
        navigator.clipboard.writeText(text)
    }
    const openSendText = () => {
        window.open(`tg://msg?text=https://t.me/vadimilyano_cryptocash_bot?start=${tg_user_id}`)
    }
    return (
        <div className='container refs_'>
            <div style={{ textAlign: 'center', display: 'flex', gap: 6, flexDirection: 'column' }}>
                <h2>Invite countryman!</h2>
                <p className='decs'>You and your countrymen will receive bonuses</p>
            </div>
            <div style={{ marginTop: 10 }} className="bonus">
                <img src={gift_1} alt="" />
                <div className="datas">
                    <h6>Invite a countryman</h6>
                    <p><img alt="" src={ref_coin_icon} />+ 5,000 for you and your countryman</p>
                </div>
            </div>
            <div className="bonus">
                <img src={gift_2} alt="" />
                <div className="datas">
                    <h6>Invite a countryman with Telegram Premium</h6>
                    <p><img alt="" src={ref_coin_icon} />+ 25,000 for you and your countryman</p>
                </div>
            </div>
            <div className="list list__empty">
                <p>{refs === 0 ? "You haven't invited anyone yet 😭" : refs === 1 ? `${refs} countryman invited` : `${refs} countrymen invited`}</p>

            </div>
            <div className="buttons">
                <button onClick={openSendText} style={{ flex: 1 }}><h5>Invite a countryman</h5></button>
                <button onClick={() => { copyHandler(`https://t.me/vadimilyano_cryptocash_bot?start=${tg_user_id}`) }}><IoCopyOutline size={28} /></button>
            </div>

        </div>
    );
}

export default Refs;