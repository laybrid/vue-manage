import axios from "axios"

axios.defaults.baseURL = "http://localhost:3000"

export function getFormData(condition?:any) {
    return axios.get('/userForm', { params: { ...condition } })
}

export function submitFormData(form: any) {
    return axios.post("/userForm", form)
}

export function getTableList(condition?:any) {
    return axios.get('/userTable',{ params: { ...condition } })
}