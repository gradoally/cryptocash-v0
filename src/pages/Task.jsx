import React, { useCallback, useEffect, useState } from 'react';
import taskTypes from '../constants/taskTypes';
import storageKeys from '../storageKeys/storageKeys';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import money from '../assets/print_navbar_icon.png'
import finishTask from '../api/finishTask';
import tg_user_id from '../constants/telegramUserId';
import getCoins from '../api/getCoins';
import pageTypes from '../constants/pageTypes';
import iron_l from '../assets/iron_l.png'
import master_l from '../assets/master_l.png'
import grandmaster_l from '../assets/grandmaster_l.png'
import legendary_l from '../assets/legendary_l.png'
import mythic_l from '../assets/mythic_l.png'
import ref_3 from '../assets/ref_3.png'
import ref_10 from '../assets/ref_10.png'
import ref_50 from '../assets/ref_50.png'
import claimTask from '../api/claimTask';

function Task({ allTasks, setPage, countryRank, totalRefs, leaguesLvl }) {
    const [tasks, setTasks] = useState([])
    const [subPage, setSubPage] = useState(taskTypes.special)
    const [currentTask, setCurrentTask] = useState(null)
    const [update123, setUpdate123] = useState(false)

    useEffect(() => {
        setTasks(allTasks.filter((word) => word.type === "special" && !JSON.parse(localStorage.getItem(storageKeys.complited_tasks)).complited_tasks.includes(word.id)))
    }, [allTasks])
    const updateCurrentTasks = useCallback(() => {
        setTasks(allTasks.filter((word) => word.type === subPage && !JSON.parse(localStorage.getItem(storageKeys.complited_tasks)).complited_tasks.includes(word.id)))
    }, [allTasks, subPage])
    useEffect(() => {
        updateCurrentTasks()
    }, [subPage, allTasks, updateCurrentTasks])

    const handleTaskStatusChange = (taskId, newStatus) => {
        setCurrentTask((prevTask) => {
            const newTasks = prevTask.tasks.map((task, idx) => {
                if (idx === taskId) {
                    return { ...task, status: newStatus };
                }
                return task;
            });
            let has_not_complite_task = false
            newTasks.forEach(task => {
                if (task.status !== 'Done') { has_not_complite_task = true }
            })
            return { ...prevTask, tasks: newTasks, complited: !has_not_complite_task };
        });
    };
    const finishHandler = async () => {
        if (currentTask.complited) {
            await finishTask(tg_user_id, currentTask.id)
            let res = await getCoins(tg_user_id)
            if (res.data.status === 401) { localStorage.clear(); setPage(pageTypes.country_select) }
            localStorage.setItem(storageKeys.coins, res.data.coins)
            localStorage.setItem(storageKeys.coins_per_click, res.data.coins_per_click)

            let complited_tasks = JSON.parse(localStorage.getItem(storageKeys.complited_tasks))
            complited_tasks.complited_tasks.push(currentTask.id)
            localStorage.setItem(storageKeys.complited_tasks, JSON.stringify(complited_tasks))
            setCurrentTask(null)
            updateCurrentTasks()
        }
    }
    const claimHandler = async (prize, storage_name) => {
        localStorage.setItem(storageKeys.coins, Number(localStorage.getItem(storageKeys.coins)) + prize)
        localStorage.setItem(storage_name, true)
        setUpdate123(!update123)
        await claimTask(tg_user_id, prize)

    }

    const moveToTask = (idx) => {
        let currentT = tasks[idx]
        let taskses = []
        for (let index = 0; index < currentT.tasks.length; index++) {
            const el = currentT.tasks[index];
            taskses.push({ "title": el.title, 'status': 'Go', 'finished': false, "url": el.url })

        }
        let t = { 'id': currentT.id, 'complited': false, 'title': currentT.title, 'icon': currentT.icon, 'money': currentT.money, 'tasks': taskses }
        setCurrentTask(t)
    }
    return (
        <div className='container task_'>
            {currentTask === null && (
                <>
                    <div className="coins_c">
                        <div className="country_data">
                            <img src={process.env.PUBLIC_URL + `/flags/${localStorage.getItem(storageKeys.country)}.png`} alt="" />
                            <p>Country rank: {countryRank}</p>
                        </div>
                        <div className="country_data">
                            <p>Your individual score:</p>
                            <h1>{localStorage.getItem(storageKeys.coins)}</h1>
                        </div>
                    </div>
                    <hr />
                    <div className="pages">
                        <button onClick={() => { setSubPage(taskTypes.special) }} className={subPage === taskTypes.special ? 'active' : ''}>Special</button>
                        <button onClick={() => { setSubPage(taskTypes.leagues) }} className={subPage === taskTypes.leagues ? 'active' : ''}>Leagues</button>
                        <button onClick={() => { setSubPage(taskTypes.ref) }} className={subPage === taskTypes.ref ? 'active' : ''}>Ref task</button>
                    </div>
                    {subPage === taskTypes.special && (
                        <div className="current_tasks">
                            {tasks.map((value, idx) => (
                                <div className="item" onClick={() => { moveToTask(idx) }} key={idx}>
                                    <div className="data">
                                        <div className="img"><img src={process.env.PUBLIC_URL + "/tasks/" + value.icon} style={{ width: '100%' }} alt="" /></div>
                                        <div className="text"><h6>{value.title}</h6><p><img src={money} alt="" />{value.money}</p></div>
                                    </div>
                                    <FaChevronRight size={20} />
                                </div>
                            ))}

                        </div>
                    )}
                    {subPage === taskTypes.leagues && (
                        <div className="current_tasks">
                            <div className={"item" + (leaguesLvl < 5000 || localStorage.getItem(storageKeys.leagues_5K_climed) === "true" ? " disabled" : "")}>
                                <div className="data">
                                    <div className="img"><img src={iron_l} style={{ width: '100%' }} alt="" /></div>
                                    <div className="text"><h6>Iron</h6><p><img src={money} alt="" />+ 5000</p></div>
                                </div>
                                <button className='claim' disabled={leaguesLvl < 5000 || localStorage.getItem(storageKeys.leagues_5K_climed) === "true"} onClick={() => { claimHandler(5_000, 'leagues_5K_climed') }}>Claim</button>
                            </div>
                            <div className={"item" + (leaguesLvl < 10000 || localStorage.getItem(storageKeys.leagues_10K_climed) === "true" ? " disabled" : "")}>
                                <div className="data">
                                    <div className="img"><img src={master_l} style={{ width: '100%' }} alt="" /></div>
                                    <div className="text"><h6>Master</h6><p><img src={money} alt="" />+ 10 000</p></div>
                                </div>
                                <button className='claim' disabled={leaguesLvl < 10000 || localStorage.getItem(storageKeys.leagues_10K_climed) === "true"} onClick={() => { claimHandler(10_000, 'leagues_10K_climed') }}>Claim</button>
                            </div>
                            <div className={"item" + (leaguesLvl < 50000 || localStorage.getItem(storageKeys.leagues_50K_climed) === "true" ? " disabled" : "")}>
                                <div className="data">
                                    <div className="img"><img src={grandmaster_l} style={{ width: '100%' }} alt="" /></div>
                                    <div className="text"><h6>Grandmaster</h6><p><img src={money} alt="" />+ 50 000</p></div>
                                </div>
                                <button className='claim' disabled={leaguesLvl < 50000 || localStorage.getItem(storageKeys.leagues_50K_climed) === "true"} onClick={() => { claimHandler(50000, 'leagues_50K_climed') }}>Claim</button>
                            </div>
                            <div className={"item" + (leaguesLvl < 100000 || localStorage.getItem(storageKeys.leagues_100K_climed) === "true" ? " disabled" : "")}>
                                <div className="data">
                                    <div className="img"><img src={legendary_l} style={{ width: '100%' }} alt="" /></div>
                                    <div className="text"><h6>Legendary</h6><p><img src={money} alt="" />+ 100 000</p></div>
                                </div>
                                <button className='claim' disabled={leaguesLvl < 100000 || localStorage.getItem(storageKeys.leagues_100K_climed) === "true"} onClick={() => { claimHandler(100000, 'leagues_100K_climed') }}>Claim</button>
                            </div>
                            <div className={"item" + (leaguesLvl < 500000 || localStorage.getItem(storageKeys.leagues_500K_climed) === "true" ? " disabled" : "")}>
                                <div className="data">
                                    <div className="img"><img src={mythic_l} style={{ width: '100%' }} alt="" /></div>
                                    <div className="text"><h6>Mythic</h6><p><img src={money} alt="" />+ 500 000</p></div>
                                </div>
                                <button className='claim' disabled={leaguesLvl < 500000 || localStorage.getItem(storageKeys.leagues_500K_climed) === "true"} onClick={() => { claimHandler(500000, 'leagues_500K_climed') }}>Claim</button>
                            </div>
                        </div>
                    )}
                    {subPage === taskTypes.ref && (
                        <div className="current_tasks">
                            <div className={"item" + (totalRefs < 3 || localStorage.getItem(storageKeys.ref_3_climed) === "true" ? " disabled" : "")}>
                                <div className="data">
                                    <div className="img"><img src={ref_3} style={{ width: '100%' }} alt="" /></div>
                                    <div className="text"><h6>Invite 3 countrymen</h6><p><img src={money} alt="" />+ 35 000</p></div>
                                </div>
                                <button className='claim' disabled={totalRefs < 3 || localStorage.getItem(storageKeys.ref_3_climed) === "true"} onClick={() => { claimHandler(35_000, 'ref_3_climed') }}>Claim</button>
                            </div>
                            <div className={"item" + (totalRefs < 10 || localStorage.getItem(storageKeys.ref_10_climed) === "true" ? " disabled" : "")}>
                                <div className="data">
                                    <div className="img"><img src={ref_10} style={{ width: '100%' }} alt="" /></div>
                                    <div className="text"><h6>Invite 10 countrymen</h6><p><img src={money} alt="" />+ 120 000</p></div>
                                </div>
                                <button className='claim' disabled={totalRefs < 10 || localStorage.getItem(storageKeys.ref_10_climed) === "true"} onClick={() => { claimHandler(120_000, 'ref_10_climed') }}>Claim</button>
                            </div>
                            <div className={"item" + (totalRefs < 50 || localStorage.getItem(storageKeys.ref_50_climed) === "true" ? " disabled" : "")}>
                                <div className="data">
                                    <div className="img"><img src={ref_50} style={{ width: '100%' }} alt="" /></div>
                                    <div className="text"><h6>Invite 50 countrymen</h6><p><img src={money} alt="" />+ 650 000</p></div>
                                </div>
                                <button className='claim' disabled={totalRefs < 50 || localStorage.getItem(storageKeys.ref_50_climed) === "true"} onClick={() => { claimHandler(650_000, 'ref_50_climed') }}>Claim</button>
                            </div>
                        </div>
                    )}
                </>
            )}
            {currentTask !== null && (
                <div className="current_task">
                    <FaChevronLeft onClick={() => { setCurrentTask(null) }} size={24} />
                    <div className="title">
                        <img src={process.env.PUBLIC_URL + "/tasks/" + currentTask.icon} style={{ width: 48 }} alt="" />
                        <h2>{currentTask.title}</h2>
                    </div>
                    <div className="reward">
                        <img style={{ width: 48 }} src={money} alt="" />
                        <div className="reward__down">
                            <h6>Reward</h6>
                            <p>{currentTask.money}</p>
                        </div>
                    </div>
                    <p style={{ marginLeft: 12 }}>Your task</p>
                    <div className="tasks">
                        {currentTask.tasks.map((value, idx) => (
                            <div className={"task" + (value.status === 'Done' ? " task__done" : '')} key={idx}>
                                <p>{value.title}</p>
                                <button onClick={() => { if (value.status !== 'Done') { window.open(value.url) }; handleTaskStatusChange(idx, 'Done') }}>{value.status}</button>
                            </div>
                        ))}
                        <button className={'finish' + (currentTask.complited ? " finish__active" : '')} onClick={finishHandler}>Finish mission</button>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Task;