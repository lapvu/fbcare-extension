import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { logout } from '../redux/auth';
import { store } from "../redux/store";
const meta = import.meta as any
const { dispatch } = store;
const axiosApiInstance = axios.create({
    baseURL: meta.env.SNOWPACK_PUBLIC_API_URL_DEV
});

axiosApiInstance.interceptors.request.use(async (config: AxiosRequestConfig) => {
    const token = await localStorage.getItem("access_token")
    if (token) {
        config.headers = {
            'Authorization': `Bearer ${token}`,
        }
    }
    return config;
}, error => {
    Promise.reject(error)
});

axiosApiInstance.interceptors.response.use((response) => { return response }, async function (error: AxiosError) {
    if (error.response?.status === 403 || error.response?.status === 401) {
        localStorage.removeItem("access_token");
        dispatch(logout())
    }
    return Promise.reject(error.response?.data);
});

export default axiosApiInstance;