import axios from "axios";
import BASE_URL from "../constants/BASE_URL";

export default async function finishTask(tg_id, task_id) {
    let res = await axios.post(`${BASE_URL}/tasks/finish`, { 'tg_id': tg_id, 'task_id': task_id })
    return res
}