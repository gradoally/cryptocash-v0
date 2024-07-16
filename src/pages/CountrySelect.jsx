import React from 'react';
import country_down_image from '../assets/country_down_image.png'
import Dropdown from "react-bootstrap/Dropdown";
import countries from '../constants/countries';
import storageKeys from '../storageKeys/storageKeys';
//import WebApp from '@twa-dev/sdk';
import authUser from '../api/authUser';
import pageTypes from '../constants/pageTypes';
import tg_user_id from '../constants/telegramUserId';

function CountrySelect({ setPage }) {
    const countryHandler = async (country) => {
        let res = await authUser(tg_user_id, country)
        localStorage.setItem(storageKeys.country, country)
        localStorage.setItem('jwt', res.data.jwt)
        setPage(pageTypes.earn)
    }
    return (
        <div className='container select_country'>
            <div className='sec1'>
                <h1>Country Selection</h1>
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Select your country
                    </Dropdown.Toggle>

                    <Dropdown.Menu className='dropdown-menu-v'>
                        {countries.map((value, idx) => (
                            <Dropdown.Item key={idx} onClick={() => { countryHandler(value) }}>{value}</Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
                <div className="main_texts">
                    <h2>Select your country wisely</h2>
                    <p>You are free to select any country you wish to fight for.However you cannot change country later on. You will lose all your earned cryptocash and start all over from zero!.</p>
                </div>
            </div>

            <img src={country_down_image} alt="" className='down_image' />
        </div>
    );
}

export default CountrySelect;