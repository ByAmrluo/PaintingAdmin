<template>
  <div class="logo" v-if="isHidden">
    <img :src="logoPath" :style="{ width, height }" />
    <p :class="layoutStore.isCollaspe ? 'fold' : ''">{{ title }}</p>
  </div>
</template>
<script lang="ts" setup>
import useLayoutSettingStore from "@/store/modules/setting";
//引入layout跟组件配置仓库
const layoutStore = useLayoutSettingStore();
defineProps({
  logoPath: {
    type: String,
    default: "H:/前端/vue/atguiguSelect/public/logo.png",
  },
  width: {
    type: String,
    default: "100px",
  },
  height: {
    type: String,
    default: "100px",
  },
  title: {
    type: String,
    default: "Painting后台管理系统",
  },
  isHidden: {
    type: Boolean,
    default: true,
  },
});
</script>

<style lang="scss" scoped>
.logo {
  padding: 20px 0px;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;

  overflow: hidden;

  p {
    color: white;

    font-size: 18px;
    // 文本超出的部分用省略号代替
    text-overflow: ellipsis;
    white-space: nowrap;

    margin-left: 10px;

    &.fold {
      width: 0px;
    }
  }

  img {
    border-radius: 50%;
    margin-left: 10px;
  }
}
</style>
<script lang="ts">
export default {
  //命名递归组件
  name: "Logo",
};
</script>
