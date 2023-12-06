//定义ts数据类型
//登录接口携带参数的类型
export interface loginForm {
    username: string,
    password: string,
}
//定义全部接口返回都拥有的类型
export interface ResponseData {
    code: number,
    message: string,
    ok: boolean,
}

//登录接口返回的数据的类型
export interface loginRes extends ResponseData {
    data: string,
}
//。获取用户信息的返回类型
export interface userInfo extends ResponseData {

    data: {
        routes: string[],
        buttons: string[],
        roles: string[],
        name: string,
        avatar: string,
    }
}

