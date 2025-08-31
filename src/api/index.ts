import axios from "axios"

axios.defaults.baseURL = "http://localhost:3000"

export function getFormData() {
    return axios.get('/userForm')
}

export function submitFormData(form: any) {
    return axios.post("/userForm", form)
}