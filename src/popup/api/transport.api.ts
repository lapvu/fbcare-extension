import axios from "./axios";

export interface Setting {
    access_token: string;
    pickup_phone: string;
    pickup_address: string;
    pickup_province: string;
    pickup_district: string;
    pickup_commune: string;
    user_id: string;
}

export function saveSetting(setting: Setting) {
    return axios.post("/transport", setting);
}

export function getSetting() {
    return axios.get("/transport");
}
