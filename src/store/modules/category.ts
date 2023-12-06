import { defineStore } from 'pinia'
import { ref } from 'vue'
import { reqCategoryOne, reqCategoryTwo, reqCategoryThree, reqCategoryList, reqAddorUpdateAttr } from '@/api/product/attr/index'
import type { CategoryLevelone, CategoryLevelOneData, AttrData, AttrDataList, AttrResData } from '@/api/product/attr/type'
import { ElLoading } from 'element-plus'
const useCategoryStore = defineStore('Category', () => {
    //分类ID
    let categoryOneId = ref<number | string>('')
    let categoryTwoId = ref<number | string>('')
    let categoryThreeId = ref<number | string>('')
    let loading = ref(null)
    let disable = ref<boolean>(true)
    //分类数据
    let res = ref<CategoryLevelone[]>()
    let resCategoryTwo = ref<CategoryLevelone[]>()
    let resCategoryThree = ref<CategoryLevelone[]>()
    // 列表数据
    let resCategoryList = ref<AttrData[]>()
    const getCategoryOne = async () => {
        let result: CategoryLevelOneData = await reqCategoryOne()
        if (result.code == 200) {
            res.value = result.data;
            return 'ok'
        }
    }
    //获取二级分类的数据
    const getCategoryTwo = async () => {
        let result: CategoryLevelOneData = await reqCategoryTwo(categoryOneId.value)
        if (result.code == 200) {
            resCategoryTwo.value = result.data
            console.log(resCategoryTwo.value);
            return 'ok'
        } else {
            return Promise.reject(new Error('获取数据失败'))
        }
    }
    //获取三级分类的数据
    const getCategoryThree = async () => {
        let result: CategoryLevelOneData = await reqCategoryThree(categoryTwoId.value)
        if (result.code == 200) {
            resCategoryThree.value = result.data
            console.log(resCategoryThree.value);
            return 'ok'
        } else {
            return Promise.reject(new Error('获取数据失败'))
        }
    }
    const getCategoryList = async () => {


        let result: AttrResData = await reqCategoryList(categoryOneId.value, categoryTwoId.value, categoryThreeId.value)

        let attr = []

        if (result.code == 200) {
            resCategoryList.value = result.data
            return 'ok'
        } else {
            return Promise.reject(new Error('获取数据失败'))
        }
    }
    //重置仓库数据
    const resetCategoty = () => {
        resCategoryList.value = []
        categoryOneId.value = ''
        categoryTwoId.value = ''
        categoryThreeId.value = ''
        disable.value = true
        //分类数据
        res.value = []
        resCategoryTwo.value = []
        resCategoryThree.value = []
        // 列表数据

    }
    return {
        res,
        categoryOneId,
        getCategoryOne,
        resCategoryTwo,
        getCategoryTwo,
        categoryTwoId,
        getCategoryThree,
        resCategoryThree,
        categoryThreeId,
        disable,
        getCategoryList,
        resCategoryList,
        resetCategoty
    }
})
export default useCategoryStore