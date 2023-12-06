//创建用户相关的小仓库
import { defineStore } from 'pinia'
import type { loginForm, loginRes, userInfo } from "@/api/user/type";
import { ref } from 'vue';
import { reqLogin, reqUserInfo, reqLogout } from '../../api/user';

import { SET_TOKEN, GET_TOKEN, RM_TOKEN } from '@/util/token';
// 引入深拷贝方法
import { cloneDeep } from 'lodash';
//引入常量路由
import { routes, asyncRoute, AnyRoute } from '@/router/routes'
//导入ts路由类型
import type { RouteRecordRaw } from 'vue-router'
import router from '@/router';
const useUserStore = defineStore('User', () => {
    //小仓库，存储数据
    const rou = ['Acl', 'Article', 'User', 'Appoint']
    //to
    const token = ref<string | null>(GET_TOKEN())
    const menuRoutes = ref<RouteRecordRaw[]>(routes)
    const username = ref<string>('')
    const avatar = ref<string>('')
    const userRoute = ref([])
    const userid = ref<number>()
    const role = ref('')
    const getLogin = async (userData: loginForm) => {
        let res: loginRes = await reqLogin(userData)
        if (res.code === 200) {
            console.log(res.data);
            avatar.value = res.data.avatarUrl;
            username.value = res.data.username
            token.value = res.data.token
            role.value = res.data.role
            userRoute.value = arrayFlat(res.data.menus)
            userRoute.value = userRoute.value.flat(2)
            userRoute.value = [...userRoute.value, ...rou]
            userid.value = res.data.id
            localStorage.setItem('menus', userRoute.value)
            SET_TOKEN(token.value as string)
            getUserInfo()
            return 'ok'
        } else if (res.code == 201) {
            return Promise.reject(new Error(res.data))
        }
    }
    // 数组扁平化
    const arrayFlat = (arr) => {
        return arr.map(item => {
            if (item.children && item.children.length > 0) {
                return [...arrayFlat(item.children)]
            }
            return item.pagePath
        })
    }
    // 过滤当前用户需要的路由
    const filterAsyncRoute = (asyncRoute: any, routes: any) => {
        return asyncRoute.filter(item => {
            if (routes.includes(item.name)) {
                if (item.children && item.children.length > 0) {
                    item.children = filterAsyncRoute(item.children, routes)
                }
                return true
            }
        })
    }
    const getUserInfo = async () => {
        if (localStorage.getItem('userInfo')) {
            let userInfo = JSON.parse(localStorage.getItem('userInfo'))
            console.log(userInfo);
            userid.value = userInfo.userid
        }

        let res: any = await reqUserInfo(userid.value)
        if (res.code == 200) {
            //获取用户信息，存入仓库并且渲染 在退出登录的时候清空用户信息并删除token
            username.value = res.data.username
            avatar.value = res.data.avatarUrl

            const arr1 = (JSON.parse(JSON.stringify(localStorage.getItem('menus'))))
            userRoute.value = arr1.split(',')
            console.log(userRoute.value);

            let userAsyncRoute = filterAsyncRoute(cloneDeep(asyncRoute), userRoute.value)
            menuRoutes.value = [...routes, ...userAsyncRoute, AnyRoute];
            console.log(menuRoutes.value);

            let all = [...userAsyncRoute, AnyRoute]
            all.forEach(route => {
                router.addRoute(route)
            })

            return 'ok'
        } else {
            return Promise.reject(new Error(res.message))
        }

    }
    const userLogout = async () => {

        //发送退出登录请求

        //清空用户信息
        username.value = ''
        avatar.value = ''
        token.value = ''
        localStorage.removeItem('menus')
        localStorage.removeItem('userInfo')
        RM_TOKEN()
        return 'ok'


    }
    return {
        getLogin,
        token,
        menuRoutes,
        getUserInfo,
        username,
        avatar,
        userid,
        userLogout,
        role,
    }
},
    {
        persist: {

            key: 'userInfo2',
            //存储在localstorage还是sessionStorage中
            storage: localStorage,
            //哪个数据需要持久化
            paths: ['token', 'username', 'avatar', 'userid', 'role']
        }
    })
export default useUserStore