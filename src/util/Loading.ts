
import { ElLoading } from 'element-plus'
let loadingInstance: any
// loading加载显示
export const startLoading = (el) => {
    loadingInstance = ElLoading.service({
        lock: true,
        target: el,
        text: 'Loading...',
        background: 'rgba(0, 0, 0, 0.7)'
    })
}
// loading加载隐藏
export const endLoading = () => {
    loadingInstance.close()
}
