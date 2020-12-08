import queryString from 'query-string';
import axios from "./axios";

export interface ProductInVO {
    product_name: string;
    product_desc: string;
    image: string;
    price: number;
    quantity: number;
}

export interface GetProductsInVO {
    limit: number;
    offset: number;
}


export function createProduct(productInVO: ProductInVO) {
    return axios.post("/product", productInVO);
}

export function updateProduct(productInVO: ProductInVO, productId: string) {
    return axios.put(`/product/${productId}`, { ...productInVO, _id: productId })
}

export function getProducts(getProductsInVO: GetProductsInVO) {
    return axios.get(`/product?${queryString.stringify(getProductsInVO as any)}`,);
}

export function deleteProduct(id: string) {
    return axios.delete(`/product/${id}`);
}

export function getProduct(id: string) {
    return axios.get(`/product/${id}`);
}

