import axios from "./axios";

export interface Setting {
    token: string;
}

export function saveSetting(setting: Setting) {
    return axios.post("/transport", setting);
}

export function getSetting() {
    return axios.get("/transport");
}
