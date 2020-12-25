import axios from "./axios";

export interface Order {
    customer_name: string;
    customer_phone: string;
    customer_id: string;
    customer_email: string;
    address: string;
    province: string;
    district: string;
    commune: string;
    weight: number;
    amount: number;
    note: string;
    products: [
        {
            sku: string,
            name: string,
            price: number,
            weight: number,
            quantity: number
        }
    ];
}

export function createOrder(order: Order) {
    return axios.post("/order", {
        ...order
    })
}

export function getOrdersByCustomer(customerId: string) {
    return axios.get(`/order/customer?id=${customerId}`)
}

export function getOrders(limit: any, offset: any) {
    return axios.get(`/order?limit=${limit}&offset=${offset}`)
}

export function getFee(invo: any) {
    return axios.post(`/order/fee`, invo);
}