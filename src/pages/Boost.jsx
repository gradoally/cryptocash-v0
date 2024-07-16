import React, { useEffect, useState } from 'react';
import storageKeys from '../storageKeys/storageKeys';
import { IoPrintOutline, IoVideocam } from "react-icons/io5";
import { SlEnergy } from "react-icons/sl";
import { FaAngleRight } from "react-icons/fa";
import { MdTouchApp } from "react-icons/md";
import { SiSpeedtest } from "react-icons/si";
import DownPopUp from '../components/DownPopUp';
import getAllBoosts from '../api/getAllBoosts';
import tg_user_id from '../constants/telegramUserId';
import pageTypes from '../constants/pageTypes';
import buyBoost from '../api/buyBoost';

function Boost({ setPage, countryRank }) {
    const [showPopUp, setShowPopUp] = useState(false)
    const [popUpData, setPopUpData] = useState({})
    const [boostsData, setBoostsData] = useState({})
    const [multiPrintPrice, setMultiPrintPrice] = useState(999999)
    const [energyLimit, setEnergyLimit] = useState(999999)
    const [rechargingSpeed, setRechargingSpeed] = useState(999999)

    useEffect(() => {
        (async () => {
            let res = await getAllBoosts(tg_user_id)
            if (res.data.status === 401) { localStorage.clear(); setPage(pageTypes.country_select) }
            setBoostsData(res.data)
            setMultiPrintPrice(Number(res.data.multi_print.split('|')[0]))
            setEnergyLimit(Number(res.data.energy_limit_lvl.split('|')[0]))
            setRechargingSpeed(Number(res.data.recharging_speed_lvl.split('|')[0]))
        })()
    }, [setPage])

    const buyHandler = async () => {
        console.log(popUpData);
        localStorage.setItem(storageKeys.coins, Number(localStorage.getItem(storageKeys.coins)) - Number(popUpData.price_lvl.split('|')[0]))
        setShowPopUp(false)
        let res = await buyBoost(tg_user_id, popUpData.name)
        if (res.data.status === 401) { localStorage.clear(); setPage(pageTypes.country_select) }
        localStorage.setItem(storageKeys.coins, res.data.coins)
        res = await getAllBoosts(tg_user_id)
        if (res.data.status === 401) { localStorage.clear(); setPage(pageTypes.country_select) }
        setBoostsData(res.data)
        setMultiPrintPrice(Number(res.data.multi_print.split('|')[0]))
        setEnergyLimit(Number(res.data.energy_limit_lvl.split('|')[0]))
        setRechargingSpeed(Number(res.data.recharging_speed_lvl.split('|')[0]))

    }
    return (
        <div className='container boost_'>
            <div className="coins_c coins_c__pading">
                <div className="country_data">
                    <img src={process.env.PUBLIC_URL + `/flags/${localStorage.getItem(storageKeys.country)}.png`} alt="" />
                    <p>Country rank: {countryRank}</p>
                </div>
                <div className="country_data">
                    <p>Your individual score:</p>
                    <h1>{localStorage.getItem(storageKeys.coins)}</h1>
                </div>
            </div>
            <h5 style={{ marginTop: 10 }}>Your daily boosters:</h5>
            <div className="daily_btns">
                <button><IoVideocam color='#fff' size={40} /><div className="text"><p>Short video</p><p>3/3</p></div></button>
                <button onClick={() => { setShowPopUp(true); setPopUpData({ 'name': 'Full Tank', 'description': 'Fill your energy to the max.', 'price_lvl': 'Free', 'image': SlEnergy }) }}><SlEnergy color='#fff' size={40} /><div className="text"><p>Full Tank</p><p>3/3</p></div></button>
            </div>
            <h5 style={{ marginTop: 10 }}>Boosters:</h5>
            <div className="boosts">
                <button disabled={multiPrintPrice > Number(localStorage.getItem(storageKeys.coins))} className={multiPrintPrice > Number(localStorage.getItem(storageKeys.coins)) ? "__no_active" : ""} onClick={() => { setShowPopUp(true); setPopUpData({ 'name': 'Multiprint', 'description': 'Increase amount of Cryptocash you can earn per swipe. +1 per swipe for each level.  ', 'price_lvl': `${boostsData.multi_print.split('|')[0]} | ${Number(boostsData.multi_print.split('|')[1].split(' ')[1]) + 1} level`, 'image': MdTouchApp }) }}><div className='r'><MdTouchApp size={32} /> <div className="text"><h6>Multiprint</h6><p>{boostsData.multi_print}</p></div></div><FaAngleRight /></button>
                <button disabled={energyLimit > Number(localStorage.getItem(storageKeys.coins))} className={energyLimit > Number(localStorage.getItem(storageKeys.coins)) ? "__no_active" : ""} onClick={() => { setShowPopUp(true); setPopUpData({ 'name': 'Energy Limit', 'description': 'Increase the limit of energy storage. energy limit for each level.', 'price_lvl': `${boostsData.energy_limit_lvl.split('|')[0]} | ${Number(boostsData.energy_limit_lvl.split('|')[1].split(' ')[1]) + 1} level`, 'image': SlEnergy }) }}><div className='r'><SlEnergy size={32} /> <div className="text"><h6>Energy Limit</h6><p>{boostsData.energy_limit_lvl}</p></div></div><FaAngleRight /></button>
                <button disabled={rechargingSpeed > Number(localStorage.getItem(storageKeys.coins))} className={rechargingSpeed > Number(localStorage.getItem(storageKeys.coins)) ? "__no_active" : ""} onClick={() => { setShowPopUp(true); setPopUpData({ 'name': 'Recharging Speed', 'description': 'Increase speed of recharge. +1 per second.', 'price_lvl': `${boostsData.recharging_speed_lvl.split('|')[0]} | ${Number(boostsData.recharging_speed_lvl.split('|')[1].split(' ')[1]) + 1} level`, 'image': SiSpeedtest }) }}><div className='r'><SiSpeedtest size={32} /> <div className="text"><h6>Recharging Speed</h6><p>{boostsData.recharging_speed_lvl}</p></div></div><FaAngleRight /></button>
                <button disabled={boostsData.has_print_bot || 200000 > Number(localStorage.getItem(storageKeys.coins))} className={boostsData.has_print_bot || 200000 > Number(localStorage.getItem(storageKeys.coins)) ? "__no_active" : ""} onClick={() => { setShowPopUp(true); setPopUpData({ 'name': 'Print Bot', 'description': 'Print Bot will tap when your energy is full. Max bot work duration is 12 hours.', 'price_lvl': '200 000', 'image': IoPrintOutline }) }}><div className='r'><IoPrintOutline size={32} /> <div className="text"><h6>Print Bot</h6><p>200 000</p></div></div><FaAngleRight /></button>
            </div>
            {showPopUp && (
                <DownPopUp closeHandler={() => { setShowPopUp(false) }}>
                    <div className="popup_data_boost">
                        <popUpData.image size={48} />
                        <h1 style={{ fontWeight: 'bold' }}>{popUpData.name}</h1>
                        <h6 style={{ fontWeight: '500' }}>{popUpData.description}</h6>
                        <p style={{ fontWeight: 'bold' }}>{popUpData.price_lvl}</p>
                        <button onClick={buyHandler}>Get it!</button>
                    </div>
                </DownPopUp>
            )}
            <div className="navbar__bottom_not_visible"></div>
        </div>
    );
}

export default Boost;