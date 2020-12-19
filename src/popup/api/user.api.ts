import axios from "./axios";

export function me() {
    return axios.get("/user/me");
}