import React, { useEffect, useState } from 'react';
import { ProgressBar } from 'react-bootstrap';
import { SlEnergy } from "react-icons/sl";
import storageKeys from '../storageKeys/storageKeys';
import updateCoins from '../api/updateCoins';
import tg_user_id from '../constants/telegramUserId';
import pageTypes from '../constants/pageTypes';
import getCoins from '../api/getCoins';
import { useSwipeable } from 'react-swipeable';
import note from '../assets/CryptocashNote.png'
import atm from '../assets/Cryptocash_ATM.png'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import swipeAnimation from '../assets/swipe_animation.lottie'

function Earn({ setPage, setCountryRankMain }) {
    const [coinCount, setCoinCount] = useState(Number(localStorage.getItem(storageKeys.coins)));
    const [energy, setEnergy] = useState(500)
    const [maxEnergy, setMaxEnergy] = useState(500)
    const [countryRank, setCountryRank] = useState(0)
    const [canSwipe, setCanSwipe] = useState(true)
    const [atmLeftPx, setAtmLeftPx] = useState('120')
    const [showSwipeText, setShowSwipeText] = useState(true)
    const [dotLottie, setDotLottie] = useState(null);
    const swipeConfig = {
        delta: 0,                             // min distance(px) before a swipe starts. *See Notes*
        preventScrollOnSwipe: false,           // prevents scroll during swipe (*See Details*)
        trackTouch: true,                      // track touch input
        trackMouse: false,                     // track mouse input
        rotationAngle: 0,                      // set a rotation angle
        touchEventOptions: { passive: true },  // options for touch listeners (*See Details*)
    }

    const swipeHandler = async (eventData) => {
        //console.log(eventData);
        if (canSwipe) {
            let leftPX = Math.round(Math.min(Math.max(eventData.event.touches[0].pageX, 120), 270))
            setAtmLeftPx(leftPX)

            if (leftPX >= 170) {
                setCanSwipe(false)
                const then_animation_h = () => {
                    let coins_per_click = Number(localStorage.getItem('coins_per_click'))
                    console.log(energy, coins_per_click);
                    if (energy >= coins_per_click) {
                        setCoinCount(coinCount + coins_per_click);
                        setEnergy(energy - coins_per_click);
                        localStorage.setItem(storageKeys.coins, coinCount + coins_per_click);
                        updateCoins(tg_user_id, coinCount + coins_per_click).then(res => {
                            if (res.data.status === 401) { localStorage.clear(); setPage(pageTypes.country_select) }
                            setCoinCount(res.data.coins)
                            setEnergy(res.data.energy)
                        })
                    }

                }
                setCanSwipe(false)
                setAtmLeftPx(120)
                let atmElement = document.querySelector('.atm');
                let animation = atmElement.animate([
                    { left: '270px' },
                    { left: '120px' }
                ], 330);
                let noteElement = document.querySelector('.note');
                console.log(noteElement);
                noteElement.animate([
                    { left: '50px' },
                    { opacity: "1" },
                    { opacity: "1" },
                    { opacity: "1" },
                    { opacity: "1" },
                    { left: '1000px' },
                ], 330);
                let note2Element = document.querySelector('.note2');
                note2Element.animate([
                    { left: '-500px' },
                    { opacity: "1" },
                    { opacity: "1" },
                    { opacity: "1" },
                    { opacity: "1" },
                    { left: '50px' },
                ], 330);
                animation.addEventListener('finish', function () {
                    then_animation_h()
                });
            }
        }
    }

    const handlers = useSwipeable({
        onSwiping: swipeHandler,
        onSwipeStart: (e) => { setCanSwipe(true); },
        ...swipeConfig,
    });
    useEffect(() => {
        (async () => {
            let res = await getCoins(tg_user_id)
            if (res.data.status === 401) { localStorage.clear(); setPage(pageTypes.country_select) }
            localStorage.setItem(storageKeys.coins, res.data.coins)
            localStorage.setItem(storageKeys.coins_per_click, res.data.coins_per_click)
            setCoinCount(res.data.coins)
            setEnergy(res.data.energy)
            setMaxEnergy(res.data.max_energy)
            setCountryRank(res.data.country_rank)
            setCountryRankMain(res.data.country_rank)
        })()
    }, [setPage, setCountryRankMain])
    const dotLottieRefCallback = (dotLottie) => {
        setDotLottie(dotLottie);
    };
    useEffect(() => {
        if (dotLottie) {
            dotLottie.addEventListener('complete', () => {
                setShowSwipeText(false)
            });
        }
    }, [dotLottie])



    return (
        <div className='container earn_'>
            <div className="coins_c">
                <div className="country_data">
                    <img src={process.env.PUBLIC_URL + `/flags/${localStorage.getItem(storageKeys.country)}.png`} alt="" />
                    <p>Country rank: {countryRank}</p>
                </div>
                <div className="country_data">
                    <p>Your individual score:</p>
                    <h1>{coinCount}</h1>
                </div>
            </div>
            <button {...handlers} className='click'>
                <img src={note} alt='' className='note' />
                <img src={note} alt='' className='note note2' />
                <img src={atm} alt='' className='atm' style={{ left: atmLeftPx }} />
                {showSwipeText && (
                    <DotLottieReact
                        src={swipeAnimation}
                        autoplay
                        className='swipeAnimation'
                        dotLottieRefCallback={dotLottieRefCallback}
                    />
                )}
            </button>

            <div className='bar'>
                <div className="bar__1">
                    <SlEnergy color='#F8CF29' size={28} />
                    <h5>{energy} / {maxEnergy}</h5>
                </div>
                <ProgressBar now={energy} max={maxEnergy} min={0} style={{ width: '100%' }} />
            </div>
        </div>
    );
}
export default Earn;