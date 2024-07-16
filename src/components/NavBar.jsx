import React from 'react';
import pageTypes from '../constants/pageTypes';
import boostIcon from '../assets/boost_navbar_icon.png'
import statsIcon from '../assets/stats_navbar_icon.png'
import printIcon from '../assets/print_navbar_icon.png'
import taskIcon from '../assets/task_navbar_icon.png'
import refIcon from '../assets/ref_navbar_icon.png'

function NavBar({ page, setPage }) {
    return (
        <div className='navbar'>
            <div className={"navbar__item" + (page === pageTypes.ref ? " navbar__item_active" : '')} onClick={() => { setPage(pageTypes.ref) }}><img src={refIcon} alt="" /><p>Ref</p></div>
            <div className={"navbar__item" + (page === pageTypes.task ? " navbar__item_active" : '')} onClick={() => { setPage(pageTypes.task) }}><img src={taskIcon} alt="" /><p>Task</p></div>
            <div className={"navbar__item" + (page === pageTypes.earn ? " navbar__item_active" : '')} onClick={() => { setPage(pageTypes.earn) }}><img src={printIcon} alt="" /><p>Print</p></div>
            <div className={"navbar__item" + (page === pageTypes.boost ? " navbar__item_active" : '')} onClick={() => { setPage(pageTypes.boost) }}><img src={boostIcon} alt="" /><p>Boost</p></div>
            <div className={"navbar__item" + (page === pageTypes.stats ? " navbar__item_active" : '')} onClick={() => { setPage(pageTypes.stats) }}><img src={statsIcon} alt="" /><p>Stats</p></div>
        </div>
    );
}

export default NavBar;