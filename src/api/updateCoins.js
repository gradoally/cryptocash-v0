import axios from "axios";
import BASE_URL from "../constants/BASE_URL";

export default async function updateCoins(tg_id, coins) {
    let res = await axios.post(`${BASE_URL}/user/update_coins`, { 'tg_id': tg_id, 'coins': coins })
    return res
}
