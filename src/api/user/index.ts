import request from "@/util/request";
import type { loginForm, loginRes, userInfo, userInfoData } from "./type";
//管理用户接口 获取用户信息的请求都放这

//项目相关的用户接口
enum API {
    LOGIN_URL = '/login',
    USERINFO_URL = '/admin/acl/index/info',
    LOGINOUT_URL = '/admin/acl/index/logout',
    // 1
    // LOGIN_URL = '/login',
    SIGNUP_URL = '/user/register',
    GETACCESS_URL = '/visitor',
    GETUSERINFO_URL = '/user/',
    UPDATEINFO_URL = '/user'
}

//登录接口
export const reqLogin = (data: loginForm) => { return request.post<any, loginRes>(API.LOGIN_URL, data) }

export const reqUserInfo = (userId: number) => { return request.get(API.GETUSERINFO_URL + userId) }