import { defineStore } from "pinia";
import { ref, watch } from 'vue'
//关于layout跟组件配置仓库
const useLayoutSettingStore = defineStore('Setting', () => {
    //小仓库，存储数据
    const isCollaspe = ref(false)
    // 控制刷新效果
    const refsh = ref(false)
    //控制暗黑效果
    const dark = ref(false)
    const color = ref('rgba(255, 69, 0, 0.68)')
    const delColor = ref('rgba(245, 108, 108, 255)')

    return {
        isCollaspe,
        refsh,
        dark,
        color,
        delColor,

    }
}, {
    persist: {

        key: 'theme',
        //存储在localstorage还是sessionStorage中
        storage: localStorage,
        //哪个数据需要持久化
        
    }
})

export default useLayoutSettingStore