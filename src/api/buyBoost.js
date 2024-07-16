import axios from "axios";
import BASE_URL from "../constants/BASE_URL";

export default async function buyBoost(tg_id, boost_name) {
    let res = await axios.post(`${BASE_URL}/boost/buy`, { 'tg_id': tg_id, 'boost_name': boost_name })
    return res
}