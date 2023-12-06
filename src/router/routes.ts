
//菜单开发权限
// 第一步：拆分路由
// 静态路由:无论用户是什么权限，都可以直接访问到的路由：login、404、数据大屏、首页（无论什么权限都可以访问）
// 异步路由：根据用户不同的权限，能访问的菜单也不同:权限管理、商品管理以及他们的子路由
// 任意路由：以上路由都没有匹配到才会访问的路由

//异步路由
export const asyncRoute = [


    {
        path: '/articleMangage',
        component: () => import('../layout/index.vue'),
        name: 'Article',
        meta: {
            title: '作品管理',
            hidden: false,
            icon: 'Lock'//菜单左侧图标,支持ele plus 的所有图标
        },
        redirect: '/articleMangage/articleInfo',
        children: [
            {
                path: '/articleMangage/commentManage',
                name: 'CommentManage',
                component: () => import('../views/ArticleManage/CommentManage.vue'),
                meta: {
                    title: '评论管理',
                    hidden: false,
                    icon: 'Headset'//菜单左侧图标,支持ele plus 的所有图标
                }
            },
            {
                path: '/articleMangage/articleInfo',
                name: 'ArticleManage',
                component: () => import('../views/ArticleManage/ArticleManage.vue'),
                meta: {
                    title: '作品信息',
                    hidden: false,
                    icon: 'OfficeBuilding'//菜单左侧图标,支持ele plus 的所有图标
                }
            },

        ]
    },
    {
        path: '/auth',
        component: () => import('../layout/index.vue'),
        name: 'Acl',
        redirect: '/auth/userManage',
        meta: {
            title: '权限管理',
            hidden: false,
            icon: 'Lock'//菜单左侧图标,支持ele plus 的所有图标
        },
        children: [

            {
                path: '/auth/roleManage',
                name: 'RoleManage',
                component: () => import('../views/auth/children/RoleManage.vue'),
                meta: {
                    title: '权限管理',
                    hidden: false,
                    icon: 'OfficeBuilding'//菜单左侧图标,支持ele plus 的所有图标
                }
            },

        ]
    },
    {

        redirect: '/user/userManage',
        component: () => import('../layout/index.vue'),
        name: 'User',
        meta: {
            title: '用户管理',
            hidden: false,
            icon: 'Lock'//菜单左侧图标,支持ele plus 的所有图标
        },
        children: [

            {
                path: '/user/userManage',
                name: 'UserManage',
                component: () => import('../views/UserManage/UserManange.vue'),
                meta: {
                    title: '用户信息',
                    hidden: false,
                    icon: 'OfficeBuilding'//菜单左侧图标,支持ele plus 的所有图标
                }
            },

        ]
    },
    {
        path: '/appoint',
        component: () => import('../layout/index.vue'),
        name: 'Appoint',
        redirect: '/appoint/appointInfo',
        meta: {
            title: '约稿管理',
            hidden: false,
            icon: 'Lock'//菜单左侧图标,支持ele plus 的所有图标
        },
        children: [
            {
                path: '/appoint/appointInfo',
                name: 'AppointManage',
                component: () => import('../views/Appoint/AppointManage.vue'),
                meta: {
                    title: '约稿信息',
                    hidden: false,
                    icon: 'Headset'//菜单左侧图标,支持ele plus 的所有图标
                }
            },


        ]
    },
]
export const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/login/Login.vue'),
        meta: {
            title: '登录',
            hidden: true,
            icon: 'Promotion'//菜单左侧图标,支持ele plus 的所有图标
        }
    },
    {
        path: '/',
        component: () => import('../layout/index.vue'),
        name: 'layout',
        redirect: '/home',
        meta: {
            title: '',
            icon: ''
        },
        children: [
            {
                path: '/home',
                name: 'Home',
                component: () => import('../views/home/Home.vue'),
                meta: {
                    title: '首页',
                    hidden: false,
                    icon: 'HomeFilled'
                }
            },
        ]

    },
]
//任意路由
export const AnyRoute =

{
    path: '/:pathMatch(.*)*',
    //动态导入
    redirect: '/404',
    name: 'Any',
    meta: {
        title: '任意路由',
        hidden: true,
        icon: 'HomeFilled'
    }
}

