import queryString from 'query-string';
import axios from "./axios";

export interface EmployeeInVO {
    email: string;
    phone: string;
    display_name: string;
}

export interface GetEmployeesInVO {
    limit: number;
    offset: number;
}


export function createEmployee(employeeInVO: EmployeeInVO) {
    return axios.post("/employee", employeeInVO);
}

export function getEmployees(getEmployeesInVO: GetEmployeesInVO) {
    return axios.get(`/employee?${queryString.stringify(getEmployeesInVO as any)}`,);
}

export function deleteEmployee(id: string) {
    return axios.delete(`/employee/${id}`);
}