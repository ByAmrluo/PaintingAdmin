//路由鉴权（一个路由什么条件下访问、什么条件下禁止访问）
import router from "@/router";
import Nprogress from 'nprogress'
//引入进度条样式
import 'nprogress/nprogress.css'
//在组件外部引入仓库必须先引入pinia
import pinia from './store'
// 全局前置守卫
import useUserStore from "./store/modules/user";
import setting from '@/setting'
import { SET_TOKEN, GET_TOKEN, RM_TOKEN } from '@/util/token';
const userStore = useUserStore(pinia)

//路由鉴权:登录成功则不能跳转登录页面 未登录成功禁止跳转其他页面;
//获取用户信息必须先刷新token 避免token失效也能访问组件的情况

router.beforeEach(async (to: any, from: any, next: any) => {
    userStore.token = GET_TOKEN()
    let token = userStore.token
    if (token) {
        if (to.matched.length > 0) {
            next()
        }
        console.log(to);
        if (to.path == '/login') {

            next({ path: '/' }); // 执行重定向  
        } else {
            await userStore.getUserInfo()
            next({ ...to, replace: true })
            if (userStore.username) {
                next()
                return;
            } else {
                try {
                    await userStore.getUserInfo()
                    next({ ...to, replace: true })
                } catch (error) {
                    await userStore.userLogout()
                    console.log(error);
                    next({ path: '/login' })
                }
            }

        }
    } else {
        if (to.matched.length > 0) { // 如果有重定向的历史记录，避免再次重定向到登录页面  
            next()
        } else {
            next({ path: '/login', query: { redirect: to.path } })
        }
    }
    Nprogress.start()
})
router.afterEach((to: any, from: any, next: any) => {
    Nprogress.done()
})
