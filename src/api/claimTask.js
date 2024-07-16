import axios from "axios";
import BASE_URL from "../constants/BASE_URL";

export default async function claimTask(tg_id, prize) {
    let res = await axios.post(`${BASE_URL}/tasks/claim`, { 'tg_id': tg_id, "prize": prize })
    return res
}