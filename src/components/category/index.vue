<template>
    <el-card class="categoryCard">
        <el-form :inline="true" class="demo-form-inline">
            <!-- 使用id作为select绑定数据 每次选择收集对应数据的id -->
            <el-form-item label="一级分类">
                <el-select v-model="CategoryStore.categoryOneId" placeholder="请选择一级分类" @change="handler">
                    <el-option v-for="(item, index) in CategoryStore.res" :key="item.id" :label="item.name" :value="item.id"
                        :disabled="scene == 0 ? false : true"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="二级分类">
                <el-select v-model="CategoryStore.categoryTwoId" placeholder="请选择二级分类" @change="handlerTwo">
                    <el-option v-for="(item, index) in CategoryStore.resCategoryTwo" :key="item.id" :label="item.name"
                        :value="item.id" :disabled="scene == 0 ? false : true"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="三级分类">
                <el-select v-model="CategoryStore.categoryThreeId" placeholder="请选择三级分类" @change="handlerThree">
                    <el-option v-for="(item, index) in CategoryStore.resCategoryThree" :key="item.id" :label="item.name"
                        :value="item.id" :disabled="scene == 0 ? false : true"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </el-card>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import useCategoryStroe from '@/store/modules/category'
const CategoryStore = useCategoryStroe()


//接收父组件传递的数据

defineProps({
    scene: {
        type: Number,
    }
})
//创建分类数据


//组件挂载完毕获取一级分类的数据

onMounted(async () => {
    //获取一级分类数据
    getCategoryLevelOne()
})

//获取一级分类数据
const getCategoryLevelOne = async () => {
    CategoryStore.getCategoryOne()
}
//一级分类下拉菜单选择值的触发事件
const handler = async () => {
    CategoryStore.resCategoryList = []
    CategoryStore.disable = true
    CategoryStore.resCategoryTwo = []
    CategoryStore.categoryTwoId = ''
    CategoryStore.resCategoryThree = []
    CategoryStore.categoryThreeId = ''
    await CategoryStore.getCategoryTwo()

}
//二级分类下拉菜单选择值的触发事件
const handlerTwo = async () => {
    CategoryStore.disable = true
    CategoryStore.resCategoryList = []
    CategoryStore.resCategoryThree = []
    CategoryStore.categoryThreeId = ''
    await CategoryStore.getCategoryThree()
    console.log(CategoryStore.resCategoryThree);
}
const handlerThree = () => {
    CategoryStore.resCategoryList = []
    CategoryStore.disable = false
}
</script>


<style lang="scss" scoped >
.el-form-item:nth-child(1) {
    margin-right: 150px;
}

.el-form-item:nth-child(2) {
    margin-right: 150px;
}
</style>
