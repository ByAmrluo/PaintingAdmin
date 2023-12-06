import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from '@/App.vue'
import router from './router';
import pinia from '@/store/index'

//@ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/theme-chalk/dark/css-vars.css'
import globalComponent from '@/components/index';

const app = createApp(App)
app.use(ElementPlus, {
    locale: zhCn,
})
//使用环境变量
import.meta.env; // 在开发环境下自动加载 .env 文件


//配置SVG插件
import 'virtual:svg-icons-register'

app.use(ElementPlus)

//引入自定义插件对象：注册整个项目的全局组件 

//引入模板的全局样式
import './style/index.scss'
//引入鉴权文件
import './permission'
//安装自定义插件
app.use(globalComponent)
app.use(pinia)
app.use(router)
//测试mock
app.mount('#app')
