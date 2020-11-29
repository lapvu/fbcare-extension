import axios from "./axios";

export function login(identifier: string, password: string) {
    return axios.post("/auth/login", {
        identifier,
        password
    })
}

export function register({ displayName, password, email, phone }: any) {
    return axios.post("/auth/register", {
        displayName,
        password,
        email,
        phone
    })
}
