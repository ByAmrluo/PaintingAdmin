//存储数据
export const SET_TOKEN = (token: string) => {
    localStorage.setItem('token', token)
}
//获取数据
export const GET_TOKEN = () => {
    return localStorage.getItem('token')
}
export const RM_TOKEN = () => {
    localStorage.removeItem('token')
}