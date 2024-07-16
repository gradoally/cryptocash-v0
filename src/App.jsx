import { useEffect, useState } from "react";
import Layout from "./layout/Layout";
import pageTypes from "./constants/pageTypes";
import CountrySelect from "./pages/CountrySelect";
import storageKeys from "./storageKeys/storageKeys";
import Earn from "./pages/Earn";
import NavBar from "./components/NavBar";
import Refs from "./pages/Refs";
import WebApp from '@twa-dev/sdk';
import device from "current-device";
import OnlyMobilePage from "./pages/OnlyMobilePage";
import video_mp4 from './assets/earn.mp4'
import Loading from "./components/Loading";
import sleep from "./functions/sleep";
import Boost from "./pages/Boost";
import Statistic from "./pages/Statistic";
import Task from "./pages/Task";
import getAllTasks from "./api/getAllTasks";
import tg_user_id from "./constants/telegramUserId";

if (localStorage.getItem(storageKeys.maxEnergy) == null) { localStorage.setItem(storageKeys.maxEnergy, 0) }
if (localStorage.getItem(storageKeys.energy) == null) { localStorage.setItem(storageKeys.energy, 0) }
if (localStorage.getItem(storageKeys.coins) == null) { localStorage.setItem(storageKeys.coins, 0) }
if (localStorage.getItem(storageKeys.coins_per_click) == null) { localStorage.setItem(storageKeys.coins_per_click, 0) }
if (localStorage.getItem(storageKeys.ref_1_climed) == null) { localStorage.setItem(storageKeys.ref_1_climed, false) }
if (localStorage.getItem(storageKeys.ref_3_climed) == null) { localStorage.setItem(storageKeys.ref_3_climed, false) }
if (localStorage.getItem(storageKeys.ref_10_climed) == null) { localStorage.setItem(storageKeys.ref_10_climed, false) }
if (localStorage.getItem(storageKeys.ref_50_climed) == null) { localStorage.setItem(storageKeys.ref_50_climed, false) }
if (localStorage.getItem(storageKeys.complited_tasks) == null) { localStorage.setItem(storageKeys.complited_tasks, JSON.stringify({ 'complited_tasks': [] })) }

function App() {
  const [page, setPage] = useState(pageTypes.loading)
  const [allTasks, setAllTasks] = useState([])
  const [totalRefs, setTotalRefs] = useState(0)
  const [leaguesLvl, setLeaguesLvl] = useState(0)
  const [countryRank, setCountryRank] = useState(0)

  useEffect(() => {
    const video = document.querySelector("#l__video");
    video.addEventListener("loadeddata", (_) => {
      sleep(2000).then(() => {
        if (localStorage.getItem(storageKeys.country) == null) {
          setPage(pageTypes.country_select)
        }
        else {
          setPage(pageTypes.earn)
        }
      })
    });
    WebApp.expand()
  }, [])
  useEffect(() => {
    if (page === pageTypes.earn) {
      getAllTasks(tg_user_id).then(res => {
        setAllTasks(res.data.data)
        setTotalRefs(res.data.total_refs)
        setLeaguesLvl(res.data.total_leagues)
      })
    }
  }, [page])
  return (
    <Layout>
      <video id='l__video' src={video_mp4} muted="muted" style={{ display: 'none' }} />

      {device.desktop() && (
        <OnlyMobilePage />
      )}
      {!device.desktop() && (
        <>
          {page === pageTypes.loading && (<Loading />)}
          {page === pageTypes.country_select && (<CountrySelect setPage={setPage} />)}
          {page === pageTypes.earn && (
            <>
              <Earn setPage={setPage} videoEarn={video_mp4} setCountryRankMain={setCountryRank} />
            </>
          )}
          {page === pageTypes.ref && (<Refs setPage={setPage} />)}
          {page === pageTypes.boost && (<Boost setPage={setPage} countryRank={countryRank} />)}
          {page === pageTypes.stats && (<Statistic setPage={setPage} />)}
          {page === pageTypes.task && (<Task setPage={setPage} allTasks={allTasks} countryRank={countryRank} totalRefs={totalRefs} leaguesLvl={leaguesLvl} />)}
          {page !== pageTypes.country_select && page !== pageTypes.loading && (<NavBar setPage={setPage} page={page} />)}
        </>
      )}
    </Layout>
  );
}

export default App;
