import axios from "axios";
import BASE_URL from "../constants/BASE_URL";

export default async function getCoins(tg_id) {
    let res = await axios.post(`${BASE_URL}/user/get_coins`, { 'tg_id': tg_id })
    return res
}