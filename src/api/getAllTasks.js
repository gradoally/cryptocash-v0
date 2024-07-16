import axios from "axios";
import BASE_URL from "../constants/BASE_URL";

export default async function getAllTasks(tg_id) {
    let res = await axios.post(`${BASE_URL}/tasks/get`, { "tg_id": tg_id })
    return res
}