<template>
  <div class="tabbar-fold">
    <!-- 顶部导航左侧 -->
    <div class="tabbar-left">
      <!-- 折叠左侧菜单：设置el-menu的collapse属性动态绑定状态，每当按钮点击就折叠侧边栏菜单
            同时重新计算侧边栏的宽度以及顶部导航栏与内容区域的宽度 -->
      <el-icon style="margin-right: 10px" @click="changeIcon" cursor="pointer">
        <component :is="layoutStore.isCollaspe ? 'Expand' : 'Fold'"></component>
      </el-icon>
      <!-- 左侧面包屑 动态显示路由名字与标题：使用route.matched获取当前路由的映射对象，如果是多级路由，则以数组的形式返回:
            动他遍历路由对象，生成对应导航
            -->
      <!-- to:根据index跳转到对应的路由 必须给el-meun添加default-active属性 要不然左侧导航不会高亮 
            在element plus 中 面包屑导航的最后一个路由不会生效to属性（最后一个路由就是当前页面）
            -->
      <el-breadcrumb separator-icon="ArrowRight">
        <template v-for="(item, index) in route.matched" :key="item.index">
          <el-breadcrumb-item
            style="text-align: center; align-items: center"
            v-if="item.meta.title"
            :to="item.path"
          >
            <el-icon>
              <component :is="item.meta.icon"></component>
            </el-icon>
            <span style="margin: 0px 2px">{{ item.meta.title }}</span>
          </el-breadcrumb-item>
        </template>
      </el-breadcrumb>
    </div>
    <!-- 顶部导航右侧 -->
    <div class="tabbar-right">
      <!-- 页面刷新，监听仓库中刷新按钮的状态，内容区域通过动态组件绑定对应的路由，通过v-if属性动态绑定，每当点击刷新都会销毁当前路由，
            使用nexTick，当所有组件挂载完毕后重新挂载刷新的路由
            -->
      <el-button size="small" circle @click="handleClickRef"
        ><el-icon> <Refresh /> </el-icon
      ></el-button>
      <!-- 全屏：调用document.fullscreenElement判断是否是全屏模式，再调用document.documentElement.requestFullscreen()
            document.documentElement.exitFullscreen() 进行全屏模式的切换（这个api有兼容性问题）-->
      <el-button size="small" circle @click="handleFullScreen"
        ><el-icon> <FullScreen /> </el-icon
      ></el-button>

      <el-popover
        placement="bottom"
        title="主题设置"
        :width="200"
        trigger="hover"
        style="position: relative"
        :temported="false"
        @show="showPopover"
      >
        <el-form :temported="false">
          <el-form-item label="主题颜色">
            <el-color-picker
              v-model="SettingStore.color"
              show-alpha
              :predefine="predefineColors"
              @change="selectThemeColor"
              v-if="colorPickeShut"
            />
          </el-form-item>
          <el-form-item label="删除按钮颜色">
            <el-color-picker
              v-model="SettingStore.delColor"
              show-alpha
              :predefine="predefineColors"
              @change="selectDelColor"
              v-if="colorPickeShut"
            />
          </el-form-item>
          <el-form-item label="暗黑模式">
            <el-switch
              v-model="SettingStore.dark"
              class="mt-2"
              style="margin-left: 24px"
              inline-prompt
              :active-icon="MoonNight"
              :inactive-icon="Sunny"
              @change="changeDarkBg"
            />
          </el-form-item>
        </el-form>
        <template #reference>
          <el-button size="small" circle>
            <el-icon> <Setting /> </el-icon
          ></el-button>
        </template>
      </el-popover>

      <img
        :src="userStore.avatar"
        style="
          border-radius: 50%;
          width: 24px;
          height: 24px;
          margin-left: 12px;
          margin-right: 12px;
        "
      />
      <!-- 下拉菜单 -->
      <el-dropdown>
        <span class="el-dropdown-link">
          {{ userStore.username }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <!-- 具名插槽 下拉菜单 -->
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script lang="ts" setup>
//引入路由对象
import { useRoute, useRouter } from "vue-router";
import { MoonNight, Sunny } from "@element-plus/icons-vue";
//引入用户仓库 获取用户信息
import useUserStore from "@/store/modules/user";
import { ref, onMounted } from "vue";
import useLayoutSettingStore from "@/store/modules/setting";
const SettingStore = useLayoutSettingStore();
//引入ts对象类型
const colorPickeShut = ref(true);
const userStore = useUserStore();
const route = useRoute();
const router = useRouter();
//引入layout跟组件配置仓库
const layoutStore = useLayoutSettingStore();

// const userInfo = ref<userInfo | any>({})

//控制图标是否折叠
const changeIcon = () => {
  console.log(route.matched);
  layoutStore.isCollaspe = !layoutStore.isCollaspe;
};

//处理刷新事件
const handleClickRef = () => {
  layoutStore.refsh = !layoutStore.refsh;
};

//处理全屏事件
const handleFullScreen = () => {
  // fullscreenElement属性，可以判断当前是不是全屏模式
  let full = document.fullscreenElement;
  if (!full) {
    //有全屏则退出全屏 ，否则全屏
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};
//处理退出登录事件
const handleLogout = async () => {
  //1向服务器发送退出登录请求
  //2删除仓库中有关当前登录用户的所有信息（toekn|ava|username）
  let flag = confirm("你确定要退出登录吗？");
  if (flag) {
    await userStore.userLogout();

    //退出登录并携带当前页面的路径 用于下次登录直接进入原来退出登录的页面
    router.push({ path: "/login" });
  }
};
// 切换背景颜色
const changeDarkBg = () => {
  let html = document.documentElement;
  SettingStore.dark ? (html.className = "dark") : (html.className = "");
};
// 设置主题颜色
const selectThemeColor = () => {
  const el = document.documentElement;
  // 获取 css 变量
  getComputedStyle(el).getPropertyValue(`--el-color-primary`);
  // 设置 css 变量
  el.style.setProperty("--el-color-primary", SettingStore.color);
  el.style.setProperty("--el-color-primary-light-5", SettingStore.color);
  colorPickeShut.value = false;
};
const selectDelColor = async () => {
  const el = document.documentElement;
  // 获取 css 变量
  getComputedStyle(el).getPropertyValue(`--el-color-danger`);
  // 设置 css 变量
  el.style.setProperty("--el-color-danger", SettingStore.delColor);
  colorPickeShut.value = false;
};
//组件挂载完毕后，获取上次的背景颜色
onMounted(() => {
  let html = document.documentElement;
  const el = document.documentElement;
  SettingStore.dark ? (html.className = "dark") : (html.className = "");
  getComputedStyle(el).getPropertyValue(`--el-color-primary`);
  // 设置 css 变量
  el.style.setProperty("--el-color-primary", SettingStore.color);
  el.style.setProperty("--el-color-primary-light-5", SettingStore.color);
  el.style.setProperty("--el-color-danger", SettingStore.delColor);
});
const showPopover = () => {
  colorPickeShut.value = true;
};
// 测试取色器
const predefineColors = ref([
  "#ff4500",
  "#ff8c00",
  "#ffd700",
  "#90ee90",
  "#00ced1",
  "#1e90ff",
  "#c71585",
  "rgba(255, 69, 0, 0.68)",
  "rgb(255, 120, 0)",
  "hsv(51, 100, 98)",
  "hsva(120, 40, 94, 0.5)",
  "hsl(181, 100%, 37%)",
  "hsla(209, 100%, 56%, 0.73)",
  "#c7158577",
]);
</script>
<script lang="ts">
export default {
  //命名递归组件
  name: "Tabbar",
};
</script>
<style lang="scss">
.tabbar-fold {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;

  .tabbar-left {
    display: flex;
    margin: 20px;
    justify-content: center;
    align-items: center;
  }

  .tabbar-right {
    display: flex;
    margin: 20px;
    justify-content: center;
    align-items: center;
  }
}
</style>
