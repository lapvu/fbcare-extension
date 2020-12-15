import axios from "./axios";

export function getInfo() {
    return axios.get("/dashboard");
}


