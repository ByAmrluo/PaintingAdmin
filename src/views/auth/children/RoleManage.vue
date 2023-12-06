<template>
  <div>
    <el-card style="height: 80px; margin: 10px 0px">
      <el-form :inline="true" class="form">
        <el-form-item label="角色搜索">
          <el-input
            placeholder="请输入需要搜素的职位"
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
      <el-button type="primary" @click="addRole">添加角色</el-button>
      <el-popconfirm
        :title="`你确定要删除这些角色吗？`"
        width="300px"
        height="300px"
        icon="Delete"
        @confirm="handlePileRemove"
      >
        <template #reference>
          <el-button
            type="danger"
            :disabled="selectIdArr.length > 0 ? false : true"
            >批量删除</el-button
          >
        </template>
      </el-popconfirm>
      <el-table
        :border="true"
        style="margin: 10px 0px"
        :data="recordsRole"
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
          type="number"
          label="ID"
          align="center"
          prop="id"
        ></el-table-column>
        <el-table-column
          label="角色名称"
          align="center"
          prop="name"
        ></el-table-column>
        <el-table-column
          label="描述"
          align="center"
          prop="description"
        ></el-table-column>
        <el-table-column
          label="唯一标示"
          align="center"
          prop="flag"
        ></el-table-column>
        <el-table-column label="操作" align="center" width="340px">
          <template #="{ row, $index }">
            <el-button type="default" @click="distrRole(row)"
              >分配权限</el-button
            >
            <el-button type="primary" @click="editUser(row, $index)"
              >编辑</el-button
            >
            <el-popconfirm
              :title="`你确定要删除${row.name}吗？`"
              width="300px"
              height="300px"
              icon="Delete"
              @confirm="handleRemove(row)"
            >
              <template #reference>
                <el-button type="danger">删除</el-button>
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
          @current-change="getRoleList"
          @size-change="hangdleSizeChange"
        />
      </div>
    </el-card>
    <el-dialog
      v-model="dialogFormVisible"
      :title="roleParams.id ? '更新角色' : '添加角色'"
    >
      <el-form :model="roleParams" :rules="rules" ref="myform">
        <el-form-item prop="name">
          <el-input
            placeholder="请输入角色名称"
            v-model="roleParams.name"
          ></el-input>
        </el-form-item>
        <el-form-item prop="description">
          <el-input
            placeholder="请输入角色职责"
            v-model="roleParams.description"
          ></el-input>
        </el-form-item>
        <el-form-item prop="flag">
          <el-input
            placeholder="请输入角色唯一标识"
            v-model="roleParams.flag"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="handlerConfirm(row)">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 抽屉组件：分配菜单权限与按钮权限  -->
    <el-drawer v-model="showRole" :show-close="false" ref="mydraw">
      <template #header="{ close, titleId, titleClass }">
        <h4 :id="titleId" :class="titleClass">分配权限</h4>
        <el-button type="danger" @click="close">
          <el-icon class="el-icon--left">
            <CircleCloseFilled />
          </el-icon>
          关闭
        </el-button>
      </template>
      <template #default>
        <!-- 

                    data:tree绑定的数据
                    show-checkbox：节点是否可被选择
                    node-key：节点唯一标识符，可用于操作节点
                    default-expanded-keys:默认展开的节点
                    default-checked-keys：默认勾选的节点的数组

                 -->
        <el-tree
          :data="rolePermission"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="roleSelected"
          :props="defaultProps"
          ref="mytree"
        />
      </template>
      <template #footer>
        <el-button type="primary" @click="handleAssignRole(row)"
          >确定</el-button
        >
        <el-button type="danger" @click="showRole = false">取消</el-button>
      </template>
    </el-drawer>
  </div>
</template>
<script lang="ts" setup>
import { nextTick, onMounted, ref } from "vue";
import {
  reqRoleList,
  reqAddorUpdateRole,
  reqRemoveRole,
  reqGetRoLeMenu,
  reqAssignAcl,
  reqAllMenuList,
} from "@/api/acl/role/index.ts";
import useSettingStore from "@/store/modules/setting";
import { ElMessage } from "element-plus";

import { startLoading } from "@/util/Loading";
import { endLoading } from "@/util/Loading";
import useUserStore from "@/store/modules/user";
const userStore = useUserStore();
const settingStore = useSettingStore();
const searchKey = ref("");
const pageNum = ref(1);
const pageLimit = ref(10);
const total = ref(40);
const dialogFormVisible = ref(false);
const myform = ref();
const showRole = ref(false);
const mytree = ref();
const mytable = ref();
const mydraw = ref();
const selectIdArr = ref([]);
//角色存储
const recordsRole = ref([]);
//添加角色与新增角色的存储
const roleParams = ref({
  name: "",
  description: "",
  flag: "",
});
//分配权限的存储
const rolePermission = ref([]);
// 存储已经选择的部分
const roleSelected = ref([]);
const getRoleList = async (page = 1) => {
  startLoading(mytable.value.$el);
  pageNum.value = page;
  if (searchKey.value.trim() != "") {
    let res = await reqRoleList(
      pageNum.value,
      pageLimit.value,
      searchKey.value
    );
    if (res.code == 200) {
      endLoading();
      recordsRole.value = res.data.records;
      console.log(recordsRole.value);

      total.value = res.data.total;
    } else {
      endLoading();
      ElMessage({
        type: "error",
        message: "没有数据！",
      });
    }
  } else {
    let res = await reqRoleList(
      pageNum.value,
      pageLimit.value,
      (searchKey.value = "")
    );
    if (res.code == 200) {
      endLoading();
      recordsRole.value = res.data.records;
      console.log(recordsRole.value);

      total.value = res.data.total;
    } else {
      endLoading();
      ElMessage({
        type: "error",
        message: "没有数据！",
      });
    }
  }
};
//分页器条目发生改变
const hangdleSizeChange = () => {
  getRoleList();
};
onMounted(() => {
  getRoleList();
});
//搜素
const handleSearch = async () => {
  let res = await getRoleList();
  searchKey.value = "";
};

//重置
const reset = () => {
  settingStore.refsh = !settingStore.refsh;
};
//添加角色
const addRole = async () => {
  await myform.value?.resetFields();
  dialogFormVisible.value = true;
  roleParams.value.roleName = "";
  roleParams.value.id = undefined;
};
//更新职位
const editUser = async (row) => {
  await myform.value?.resetFields();
  dialogFormVisible.value = true;
  roleParams.value.name = row.name;
  roleParams.value.description = row.description;
  roleParams.value.flag = row.flag;
  roleParams.value.id = row.id;
};
// 分配权限按钮
const distrRole = async (row) => {
  roleSelected.value = [];
  startLoading(mydraw.value.$refs.drawerRef);

  console.log(1);
  showRole.value = true;
  roleParams.value.id = row.id;
  roleParams.value.flag = row.flag;
  try {
    let res = await reqAllMenuList();
    let res2 = await reqGetRoLeMenu(row.id);
    if (res.code == 200 && res2.code == 200) {
      endLoading();
      rolePermission.value = res.data;
      console.log(res2.data);
      console.log(mytree.value.getNode());
      nextTick(() => {
        res2.data.forEach((item) => {
          console.log(item);

          if (
            mytree.value.getNode(item) &&
            (!mytree.value.getNode(item).childNodes ||
              !mytree.value.getNode(item).childNodes.length)
          ) {
            roleSelected.value.push(item);
          }
        });
        mytree.value.setCheckedKeys(roleSelected.value);
        console.log(roleSelected.value);
      });
    } else {
      endLoading();
      ElMessage({
        type: "error",
        message: "没有数据！",
      });
    }
  } catch (error) {
    endLoading();
  }
};

const handleAssignRole = async (row) => {
  let roleId = roleParams.value.id;
  let selectChildrenId = mytree.value.getCheckedKeys();
  let selectHalfCheckedId = mytree.value.getHalfCheckedKeys();
  let selectedArrId = [...selectChildrenId, ...selectHalfCheckedId];
  console.log(selectedArrId);
  let res = await reqAssignAcl(roleId, selectedArrId);
  if (res.code == 200) {
    ElMessage({
      type: "success",
      message: "分配成功",
    });
 
  
    if (!userStore.role) {
      let obj = JSON.parse(localStorage.getItem("userInfo"));
      userStore.role = obj.role;
    }
    if (userStore.role == roleParams.value.flag) {
      userStore.userLogout();
      window.location.reload();
    }
  } else {
    ElMessage({
      type: "error",
      message: "分配失败",
    });
  }

  showRole.value = false;
};
//点击确定发送请求
const handlerConfirm = async (row) => {
  await myform.value.validate();
  let res = await reqAddorUpdateRole(roleParams.value);
  if (res.code == 200) {
    ElMessage({
      type: "success",
      message: roleParams.value.id ? "更新成功" : "添加成功",
    });
    // 如果更新的是当前用户的角色权限则强制退出登录
    console.log(userStore.role, row.role);

    getRoleList(roleParams.value.id ? pageNum.value : 1);
  } else {
    ElMessage({
      type: "error",
      message: roleParams.value.id ? "更新失败" : "添加失败",
    });
  }
  dialogFormVisible.value = false;
};
const validatorRoleName = (role: any, value: any, callback: any) => {
  if (value.trim().length >= 2) {
    callback();
  } else {
    callback(new Error("长度至少2位"));
  }
};
//删除角色
const handleRemove = async (row) => {
  let res = await reqRemoveRole(row.id);
  if (res.code == 200) {
    ElMessage({
      type: "success",
      message: "删除成功",
    });
    getRoleList(
      recordsRole.value.length > 0 ? pageNum.value : pageNum.value - 1
    );
  } else {
    ElMessage({
      type: "error",
      message: "删除失败",
    });
  }
};
// 批量删除
const handlePileRemove = async () => {
  let idList = selectIdArr.value.map((item) => {
    return item.id;
  });
  let res = await reqRemoveRole(idList);
  if (res.code == 200) {
    ElMessage({
      type: "success",
      message: "删除成功！",
    });
    getRoleList(
      recordsRole.value.length > 0 ? pageNum.value : pageNum.value - 1
    );
  } else {
    ElMessage({
      type: "error",
      message: "删除失败！",
    });
  }
};
//校验规则
const rules = {
  roleName: [
    {
      trigger: "blur",
      required: true,
      validator: validatorRoleName,
    },
  ],
};
// 选择回调
const selectChange = (value) => {
  selectIdArr.value = value;
};
const defaultProps = {
  children: "children",
  label: "name",
};
</script>
<style lang="scss" scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
