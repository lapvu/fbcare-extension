import axios from "axios";
const meta = import.meta as any


export function getProvince() {
    return axios.get(meta.env.SNOWPACK_PUBLIC_ADDRESS_API + "/province")
}

export function getDistrict(id: number) {
    return axios.get(`${meta.env.SNOWPACK_PUBLIC_ADDRESS_API}/district?province=${id}`)
}

export function getCommune(id: number) {
    return axios.get(`${meta.env.SNOWPACK_PUBLIC_ADDRESS_API}/commune?district=${id}`)
}