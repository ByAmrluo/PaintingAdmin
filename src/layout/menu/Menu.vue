<template>
    <!-- 将路由数组导入仓库共享,再递归创建侧边栏菜单 -->
    <template v-for="(item, index) in menuList " :key="item.path">
        <!-- 如果没有子路由则直接创建 -->
        <template v-if="!item.children">
            <el-menu-item v-if="!item.meta.hidden" :index="item.path" @click="goRoute">
                <el-icon>
                    <component :is="item.meta.icon"></component>
                </el-icon>
                <template #title>

                    <span>{{ item.meta.title }}</span>
                </template>
            </el-menu-item>
        </template>
        <!-- 有子路由但是路由数量为1也直接创建 -->
        <template v-if="item.children && item.children.length == 1">
            <!-- 判断是否需要隐藏 -->
            <el-menu-item v-if="!item.children[0].meta.hidden" :index="item.children[0].path" @click="goRoute">
                <el-icon>
                    <component :is="item.children[0].meta.icon"></component>
                </el-icon>
                <template #title>
                    <span>{{ item.children[0].meta.title }}</span>
                </template>
            </el-menu-item>
        </template>

        <!-- 有多个子路由 则递归创建路由 -->
        <template v-if="item.children && item.children.length >= 2">
            <el-sub-menu v-if="!item.meta.hidden" :index="item.path">
                <template #title>
                    <el-icon>
                        <component :is="item.meta.icon"></component>
                    </el-icon>
                    <span>{{ item.meta.title }}</span>
                </template>
                <Menu :menuList="item.children"></Menu>
            </el-sub-menu>
        </template>

    </template>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router'
defineProps(['menuList'])
const router = useRouter()
const goRoute = (vc: any) => {
    router.push(vc.index)
}
</script>
<script lang="ts">
export default {
    //命名递归组件
    name: 'Menu'
}
</script>


<style lang="scss">
/*隐藏文字*/
.el-menu--collapse .el-submenu__title span {
    display: none;
}

/*隐藏 > */
.el-menu--collapse .el-submenu__title .el-submenu__icon-arrow {
    display: none;
}
</style>