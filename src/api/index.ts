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

export function addTableList(form: any) {
    return axios.post('/userTable', form)
}

export function updateTableList(form: any) {
    return axios.put('/userTable/' + form.id, form)
}

export function deleteTableList(id: string | undefined) {
    return axios.delete('/userTable/' + id)
}

//文件上传base64
export function uploadFileBase64(file: any) {
    return axios.post('/userImg', file)
}