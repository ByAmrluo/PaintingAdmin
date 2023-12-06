//引入全局组件
import SvgIcon from "@/components/SvgIcon/SvgIcon.vue";
import Category from '@/components/category/index.vue'
import type { App } from 'vue';
//引入所有Icon图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const allGlobalComponent: any = {
    SvgIcon,
    Category,
}
export default {
    install(app: any): any {
        Object.keys(allGlobalComponent).forEach(item => {
            app.component(item, allGlobalComponent[item])
        })
        //将element plus 图标注册为全局组件
        for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
            app.component(key, component)
        }
    }
}