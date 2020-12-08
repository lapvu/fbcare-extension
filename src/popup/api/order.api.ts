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

export function getOrdersByCustomer({ customerId }: any) {
    return axios.get(`/order/${customerId}`)
}

export function getOrders({ displayName, password, email, phone }: any) {
    return axios.post("/auth/register", {
        displayName,
        password,
        email,
        phone
    })
}
