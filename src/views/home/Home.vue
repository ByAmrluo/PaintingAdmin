<template>
  <el-card>
    <div class="box">
      <img
        :src="userStore.avatar"
        style="width: 100px; height: 100px; border-radius: 50%"
      />
      <div class="info">
        <h3>{{ title }}</h3>
        <p>欢迎来到Painting后台管理系统</p>
      </div>
    </div>
  </el-card>
  <div class="bottom">
    <SvgIcon prefix="#icon-welcome" width="400px" height="500px"></SvgIcon>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { getTime } from "@/util/time";
//引入用户仓库 获取用户信息
import useUserStore from "@/store/modules/user";
import SvgIcon from "@/components/SvgIcon/SvgIcon.vue";
const userStore = useUserStore();
//首页加载完毕获取当前用户的信息
const title = ref("");
onMounted(() => {
  userStore.getUserInfo();
  title.value = getTime() + "," + userStore.username;
});
</script>

<style lang="scss" scoped>
.bottom {
  display: flex;
  align-items: center;
  justify-content: center;
}

.box {
  display: flex;
  align-items: center;

  .info {
    display: flex;
    flex-direction: column;
    margin-left: 10px;

    h3 {
      margin-bottom: 20px;
      font-weight: bold;
      font-size: 26px;
    }

    p {
      color: #999999;
      font-style: italic;
    }
  }
}
</style>
