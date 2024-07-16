import axios from "axios";
import BASE_URL from "../constants/BASE_URL";

export default async function authUser(tg_id, country) {
    let res = await axios.post(`${BASE_URL}/user/auth`, { 'tg_id': tg_id, 'country': country })
    return res
}
