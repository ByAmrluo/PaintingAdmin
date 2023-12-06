<template>
  <div class="login-container">
    <el-form>
      <el-row center>
        <el-col :span="3" :xs="2"> </el-col>
        <el-col :span="12" :xs="24">
          <el-form
            class="login-form"
            :model="userData"
            :rules="rules"
            ref="myform"
          >
            <h1>Hello</h1>
            <h2>欢迎来到Painting!</h2>
            <el-form-item prop="username">
              <el-label for="username">用户名</el-label>
              <el-input
                type="username"
                id="username"
                name="username"
                :prefix-icon="Unlock"
                v-model="userData.username"
              ></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-label for="password">密码</el-label>
              <el-input
                type="password"
                id="password"
                name="password"
                :prefix-icon="Lock"
                v-model="userData.password"
                show-password
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleLogin" :loading="loading"
                >登录</el-button
              >
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script lang="ts" setup>
//@ts-ignore

import { WarningFilled, Lock, Unlock } from "@element-plus/icons-vue";
import type { loginForm } from "@/api/user/type";
//@ts-ignore
import { ref } from "vue";
import { ElNotification } from "element-plus";
//引入获取时间函数
import { getTime } from "@/util/time";
import useUserStore from "@/store/modules/user";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
const store = useUserStore();
let myform = ref();
let userData = ref<loginForm>({
  username: "Mrlin",
  password: "Mrlin123",
});
const loading = ref(false);
/**
 *
 * @param validatorName  用户名校验回调函数
 * @param validatorPass 密码校验回调函数
 */
const validatorName = (rule: any, value: any, callback: any) => {
  //rule 数组校验规则对象 value为表单元素的文本内容
  //符合校验则通过callback 放行通过 不符合也需要通过callback注入失败信息
  if (value.length >= 5) {
    callback();
  } else {
    callback(new Error("账号长度至少5位"));
  }
};
const validatorPass = (rule: any, value: any, callback: any) => {
  if (value.length >= 5 && value.length <= 20) {
    callback();
  } else {
    callback(new Error("密码长度需要在6-20之间"));
  }
};
//定义表单验证需要的配置对象
const rules = {
  username: [
    {
      //required配置表单是否必填 message错误的提示信息 trigger 触发校验的时机
      // required: true, message: '用户名不能为空！', trigger: 'blur'
      trigger: "change",
      validator: validatorName,
    },
  ],
  password: [
    {
      trigger: "change",
      validator: validatorPass,
    },
    // {
    //     min: 6, max: 20, message: '密码长度必须大于6位', trigger: 'change'
    // }
  ],
};

const handleLogin = async () => {
  await myform.value.validate();
  loading.value = true;
  store
    .getLogin(userData.value)
    .then(async (res) => {
      //使用elementplus消息通知组件
      ElNotification({
        type: "success",
        message: "登录成功",
        title: `Hi,${getTime()}`,
      });
      loading.value = false;
      let redirect: any = "/";
      if (redirect) {
        router.push("/home");
        // 成功登录后重新获取用户信息 在页面刷新的时候丢失数据，
        // 写法1 用户登录后重新发请求获取用户的信息，存入到本地存储，每次刷新页面的时候从本地获取用户信息
        const userStore = useUserStore();
        try {
          await userStore.getUserInfo();
          let userInfo: any = {
            username: userStore.username,
            avatar: userStore.avatar,
            userid: userStore.userid,
            role: userStore.role,
          };
          localStorage.setItem("userInfo", JSON.stringify(userInfo));
        } catch (error) {
          console.log(123);
          userStore.userLogout();
          router.push("/home");
        }

        // 将用户信息存入本地存储

        //写法2 使用全局守卫 每次切换路由的时候发送
      } else {
        router.push("/");
      }
    })
    .catch((err) => {
      loading.value = false;
      if (err.message == "null") {
        console.log(err.message);
        err.message = "没有该账号！";
        userData.value.username = "";
      } else {
        userData.value.password = "";
      }
      ElNotification({
        type: "error",
        message: (err as Error).message,
      });
    });
};
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  background-color: #2d3a4b;
  color: #fff;
  background-size: cover;

  .login-form {
    position: relative;
    display: flex;
    flex-direction: column;
    background-color: rgba(0, 0, 0, 0.7);
    padding: 50px;
    width: 600px;
    height: 450px;
  }

  h1 {
    font-size: 40px;
    margin-bottom: 20px;
  }

  h2 {
    font-size: 30px;
    margin-bottom: 20px;
  }
}
</style>
