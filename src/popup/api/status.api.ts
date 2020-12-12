import axios from "./axios";

export function getOrderStatus() {
    return axios.get("https://api.mysupership.vn/v1/partner/orders/status");
}
