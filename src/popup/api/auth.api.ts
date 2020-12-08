import axios from "./axios";

export function login(identifier: string, password: string) {
    return axios.post("/auth/login", {
        identifier,
        password
    })
}

export function register({ display_name, password, email, phone }: any) {
    return axios.post("/auth/register", {
        display_name,
        password,
        email,
        phone
    })
}
