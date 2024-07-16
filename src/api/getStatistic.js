import axios from "axios";
import BASE_URL from "../constants/BASE_URL";

export default async function getStatistic() {
    let res = await axios.post(`${BASE_URL}/stats/total`)
    return res
}