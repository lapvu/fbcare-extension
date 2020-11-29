import axios from "./axios";

export interface Note {
    note: string;
    customer_id: string;
}

export function addNote(order: Note) {
    return axios.post("/note", {
        ...order
    })
}

export function getNotes(customer_id: string) {
    return axios.get(`/note?customer_id=${customer_id}`)
}

export function deleteNote(note_id: string) {
    return axios.delete(`/note?customer_id=${note_id}`)
}