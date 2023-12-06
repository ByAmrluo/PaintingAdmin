<template>
  <div>
    <el-card style="height: 80px; margin: 10px 0px">
      <el-form :inline="true" class="form">
        <el-form-item label="用户名">
          <el-input
            placeholder="请输入需要搜索的用户名"
            v-model="searchKey"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="handleSearch"
            :disabled="searchKey == '' ? true : false"
            >搜索</el-button
          >
          <el-button type="danger" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-button type="primary" @click="addUser">添加用户</el-button>

      <el-table
        :border="true"
        style="margin: 10px 0px"
        :data="recordsUser"
        @selection-change="selectChange"
        ref="mytable"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column
          type="index"
          label="序号"
          width="80px"
          align="center"
        ></el-table-column>
        <el-table-column
          label="用户姓名"
          align="center"
          prop="username"
        ></el-table-column>
        <el-table-column
          label="性别"
          align="center"
          prop="gender"
        ></el-table-column>
        <el-table-column
          label="职业"
          align="center"
          prop="vocation"
        ></el-table-column>
        <el-table-column
          label="地址"
          align="center"
          prop="home"
        ></el-table-column>
        <el-table-column
          label="联系方式"
          align="center"
          prop="phone"
        ></el-table-column>
        <el-table-column label="用户角色" align="center">
          <template #="{ row, $index }">
            {{
              row.roleName == "" || row.roleName == null ? "无" : row.roleName
            }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="340px" align="center">
          <template #="{ row, $index }">
            <el-button type="primary" @click="editUser(row, $index)"
              >编辑</el-button
            >
            <el-popconfirm
              :title="`你确定要删除${row.name}吗？`"
              width="300px"
              height="300px"
              icon="Delete"
              @confirm="handleRemve(row)"
            >
              <template #reference>
                <el-button type="danger">{{
                  row.enabled == 1 || row.enabled == null ? "禁用" : "解禁"
                }}</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div class="demo-pagination-block" style="margin-top: 10px">
        <el-pagination
          v-model:current-page="pageNum"
          v-model:page-size="pageLimit"
          :page-sizes="[4, 6, 8, 10]"
          :background="true"
          layout=" , prev, pager, next, jumper,->,sizes,total,"
          :total="total"
          @current-change="getUserList"
          @size-change="hangdleSizeChange"
        />
      </div>
      <el-drawer v-model="visible" :show-close="false">
        <template #header="{ close, titleId, titleClass }">
          <h4 :id="titleId" :class="titleClass">
            {{ userParams.id ? "修改用户" : "添加用户" }}
          </h4>
          <el-button type="danger" @click="close">
            <el-icon class="el-icon--left">
              <CircleCloseFilled />
            </el-icon>
            关闭
          </el-button>
        </template>
        <template #default>
          <el-form :model="userParams" :rules="rules" ref="myform">
            <el-form-item label="用户姓名" prop="username" label-width="80">
              <el-input
                placeholder="请输入用户姓名"
                v-model="userParams.username"
              ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password" label-width="80">
              <el-input
                placeholder="请输入用户密码"
                v-model="userParams.password"
                :disabled="flag"
              ></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="hits" label-width="80">
              <el-select
                v-model="userParams.gender"
                class="m-2"
                placeholder="男"
                size="large"
              >
                <el-option key="男" label="男" value="男" />
                <el-option key="女" label="女" value="女" />
              </el-select>
            </el-form-item>

            <el-form-item label="职业" prop="vocation" label-width="80">
              <el-input v-model="userParams.vocation"></el-input>
            </el-form-item>
            <el-form-item label="地址" prop="home" label-width="80">
              <el-input v-model="userParams.home"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="phone" label-width="80">
              <el-input v-model="userParams.phone"></el-input>
            </el-form-item>
            <el-form-item label="角色" prop="roleName" label-width="80">
              <el-select
                v-model="userParams.roleName"
                class="m-2"
                placeholder="请选择用户角色"
                size="large"
              >
                <el-option
                  v-for="item in roleOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.flag"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </template>
        <template #footer>
          <el-button type="primary" @click="handleConfirm">确定</el-button>
          <el-button type="danger" @click="cancelAssignRole">取消</el-button>
        </template>
      </el-drawer>
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { reqUserList, reqAddOrUpdateUser } from "@/api/acl/user/index";
import { reqRoleList } from "@/api/acl/role/index.ts";
import { ElMessage } from "element-plus";
import { startLoading } from "@/util/Loading";
import { endLoading } from "@/util/Loading";
import useSettingStore from "@/store/modules/setting";
import useUserStore from "@/store/modules/user";
const userStore = useUserStore();
const settingStore = useSettingStore();
const pageNum = ref(1);
const pageLimit = ref(7);
const total = ref(0);
const showRole = ref(false);
const currentRole = ref("");
const roleOptions = ref([]);
const mytable = ref();
//收集用户输入的关键字
const searchKey = ref("");
//控制添加页面
const visible = ref(false);
//存储用户列表
let recordsUser = ref([]);
//获取表单实例
const myform = ref();
//批量删除存放的数组
const selectIdArr = ref([]);
//收集新增获更新用户信息
let timer = ref<any>(-1);

let userParams = ref({
  username: "",
  password: "",
  roleName: "",
  role: "",
  vocation: "",
  phone: "",
  gender: "男",
  home: "",
  enabled: 0,
});

//获取用户信息 页码每次变化会自动注入当前页面
const getUserList = async (page = 1) => {
  pageNum.value = page;
  startLoading(mytable.value.$el);
  if (searchKey.value.trim() == "") {
    let res = await reqUserList(pageNum.value, pageLimit.value);
    if (res.code == 200) {
      endLoading();
      recordsUser.value = res.data.records;
      total.value = res.data.total;
      console.log(recordsUser.value);
    } else {
      endLoading();
      ElMessage({
        type: "error",
        message: "没有数据！",
      });
    }
  } else {
    let res = await reqUserList(
      pageNum.value,
      pageLimit.value,
      searchKey.value
    );
    if (res.code == 200) {
      endLoading();
      recordsUser.value = res.data.records;
      total.value = res.data.total;
      console.log(recordsUser.value);
    } else {
      endLoading();
      ElMessage({
        type: "error",
        message: "没有数据！",
      });
    }
  }
};
// 当前页面条目数量发生改变的时候触发的回调
const hangdleSizeChange = () => {
  getUserList();
};
onMounted(() => {
  getUserList();
});
//添加用户回调
const addUser = async () => {
  await myform.value?.resetFields();
  userParams.value.id = undefined;
  userParams.value.password = "";
  visible.value = true;
  console.log(userParams.value);
};
//编辑用户回调
const editUser = async (row: any, index) => {
  console.log(row);

  await myform.value?.resetFields();
  visible.value = true;
  Object.assign(userParams.value, row);
  currentRole.value = row.role;
  console.log(userParams.value);
  let res = await reqRoleList(1, 1000);
  if (res.code == 200) {
    roleOptions.value = res.data.records;
  }
};

//取消分配角色
const cancelAssignRole = () => {
  showRole.value = false;
  visible.value = false;
};

//删除用户
const handleRemve = async (row) => {
  Object.assign(userParams.value, row);
  if (userParams.value.enabled == 1) {
    userParams.value.enabled = 0;
  } else {
    userParams.value.enabled = 1;
  }
  let res = await reqAddOrUpdateUser(userParams.value);
  if (res.code == 200) {
    ElMessage({
      type: "success",
      message: "成功",
    });
    console.log(recordsUser.value);

    getUserList(
      recordsUser.value.length > 0 ? pageNum.value : pageNum.value - 1
    );
  } else {
    ElMessage({
      type: "error",
      message: "失败",
    });
  }
};
//table复选框触发时回调 会自动注入当前的信息
const selectChange = (value) => {
  selectIdArr.value = value;
};

//搜索
const handleSearch = async () => {
  let res = await getUserList();
};
//重置
const reset = () => {
  settingStore.refsh = !settingStore.refsh;
};
//表单验证
const validatorName = (rule: any, value: any, callback: any) => {
  if (value.length >= 2) {
    callback();
  } else {
    callback(new Error("用户名至少2位"));
  }
};
const validatoruserName = (rule: any, value: any, callback: any) => {
  if (value.length >= 3) {
    callback();
  } else {
    callback(new Error("用户名至少3"));
  }
};
const validatorPass = (rule: any, value: any, callback: any) => {
  if (value.length >= 6 && value.length <= 20) {
    callback();
  } else {
    callback(new Error("密码至少6位"));
  }
};
const rules = {
  name: [
    {
      trigger: "blur",
      validator: validatorName,
      required: true,
    },
  ],
  username: [
    {
      //required配置表单是否必填 message错误的提示信息 trigger 触发校验的时机
      // required: true, message: '用户名不能为空！', trigger: 'blur'
      trigger: "blur",
      validator: validatoruserName,
      required: true,
    },
  ],
  password: [
    {
      trigger: "blur",
      validator: validatorPass,
      required: true,
    },
  ],
};

//点击确定按钮后发送请求
const handleConfirm = async () => {
  await myform.value.validate();
  userParams.value.role = userParams.value.roleName;
  userParams.value.roleName = undefined;
  let res = await reqAddOrUpdateUser(userParams.value);
  if (res.code == 200) {
    visible.value = false;
    ElMessage({
      type: "success",
      message: userParams.value.id ? "修改成功" : "添加成功",
    });
    //如果更新了当前登录的账号，则强制刷新，回归登录页面

    let obj = JSON.parse(localStorage.getItem("userInfo"));
    userStore.role = obj.role;
    console.log(userStore.role);
    console.log(currentRole.value);

    if (userStore.role == currentRole.value) {
      userStore.userLogout();
      window.location.reload();
    }

    getUserList();
  } else {
    ElMessage({
      type: "error",
      message: userParams.value.id ? "修改失败" : "添加失败",
    });
    visible.value = false;
  }
};
onBeforeUnmount(() => {
  clearTimeout(timer.value);
});
</script>
<style lang="scss" scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
