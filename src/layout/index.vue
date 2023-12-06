<template>
  <div class="layout-container">
    <!-- 侧边导航 -->
    <div
      class="layout-slider"
      :class="layoutStore.isCollaspe ? 'fold' : ''"
      :style="
        layoutStore.dark
          ? 'background-color:#none;'
          : 'background-color:#001529;'
      "
    >
      <!-- 滚动组件展示导航菜单 -->
      <el-scrollbar class="scorll">
        <el-menu
          :default-active="route.path"
          text-color="#959ea6"
          :background-color="layoutStore.dark ? '' : '#001529'"
          active-text-color="#fff"
          :collapse="layoutStore.isCollaspe"
          :router="true"
        >
          <!-- 侧边栏菜单 -->
          <!-- 应该把Logo组件放进el-menu内部否则会出现Logo标题无法折叠的情况 -->
          <Logo
            width="40px"
            height="40px"
            logoPath="../../public/logo.png"
          ></Logo>
          <Menu :menuList="userStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部导航栏 -->
    <div
      class="tabbar"
      :class="layoutStore.isCollaspe ? 'fold' : ''"
      :style="
        layoutStore.dark
          ? 'background-color:#none;'
          : 'background-color: #ffffff;'
      "
    >
      <Tarbbar></Tarbbar>
    </div>
    <!-- 内容区域 -->
    <div
      class="main"
      :class="layoutStore.isCollaspe ? 'fold' : ''"
      :style="
        layoutStore.dark
          ? 'background-color:#none;'
          : 'background-color: #ffffff;'
      "
    >
      <Main></Main>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Logo from "@/components/logo/Logo.vue";
import Menu from "@/layout/menu/Menu.vue";
import useUserStore from "@/store/modules/user";
import { useRoute } from "vue-router";
import Main from "@/layout/main/Main.vue";
import { onMounted } from "vue";
const route = useRoute();
//引入顶部Tabbar
import Tarbbar from "@/layout/tabbar/Tabbar.vue";
import useLayoutSettingStore from "@/store/modules/setting";
//引入layout跟组件配置仓库
const layoutStore = useLayoutSettingStore();
const userStore = useUserStore();
onMounted(() => {
  console.log(userStore.menuRoutes);
});
//定义折叠状态
</script>
<style lang="scss" scoped>
.layout-container {
  width: 100%;
  height: 100vh;

  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-thumb {
    width: 10px;
    border-radius: 10px;
  }

  .layout-slider {
    width: $base-meau-width;

    height: 100vh;
    transition: all 0.5s;

    &.fold {
      width: $base-menu-min;
    }

    .el-menu {
      border-right: 0;
    }

    .scorll {
      height: calc(100vh - 100px);
    }
  }

  .tabbar {
    position: fixed;
    top: 0;
    left: $base-meau-width;
    height: 50px;
    width: calc(100% - $base-meau-width);
    transition: all 0.5s;

    &.fold {
      width: calc(100vw - $base-menu-min);
      left: $base-menu-min;
    }
  }

  .main {
    position: absolute;
    left: $base-meau-width;
    width: calc(100% - $base-meau-width);
    height: calc(100vh - 50px);

    top: 50px;
    padding: 20px;
    overflow-y: scroll;
    transition: all 0.5s;

    &.fold {
      width: calc(100vw - $base-menu-min);
      left: $base-menu-min;
    }
  }
}

.el-menu--collapse .el-submenu__title span {
  display: none;
}

/*隐藏 > */
.el-menu--collapse .el-submenu__title .el-submenu__icon-arrow {
  display: none;
}
</style>
