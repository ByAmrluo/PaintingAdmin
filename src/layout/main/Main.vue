<template>
  <router-view v-slot="{ Component }">
    <!-- 动态渲染一级路由的子路由 -->
    <transition>
      <component :is="Component" v-if="flag"></component>
    </transition>
  </router-view>
</template>

<script lang="ts" setup>
import useLayoutSettingStore from "@/store/modules/setting";
import { watch, ref, nextTick } from "vue";
//引入layout跟组件配置仓库
const layoutStore = useLayoutSettingStore();
const flag = ref(true);
//监听刷新按钮的状态
watch(
  () => layoutStore.refsh,
  () => {
    //销毁路由组件
    flag.value = false;

    nextTick(() => {
      flag.value = true;
    });
  }
);
</script>
