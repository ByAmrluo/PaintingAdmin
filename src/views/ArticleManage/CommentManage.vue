<template>
  <div>
    <el-card style="margin: 20px 0">
      <el-form :inline="true" class="form">
        <el-form-item label="用户名">
          <el-input
            placeholder="请输入需要搜索的评论"
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
          <el-popconfirm
            :title="`你确定要删除这些用户吗？`"
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
        </el-form-item>
      </el-form>
      <el-card>
        <div>
          <el-table
            :border="true"
            :data="comments"
            ref="mytable"
            @selection-change="selectChange"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column
              label="序号"
              align="center"
              width="180px"
              type="index"
            >
            </el-table-column>
            <el-table-column
              label="评论文章"
              align="center"
              prop="title"
              width="200px"
            >
              <template #="{ row, $index }">
                {{ row.title }}
              </template>
            </el-table-column>
            <el-table-column
              label="评论用户"
              align="center"
              prop="name"
              width="100px"
            >
              <template #="{ row, $index }">
                {{ row.name }}
              </template>
            </el-table-column>
            <el-table-column label="评论内容" align="center">
              <template #="{ row, $index }">
                {{ row.content }}
              </template>
            </el-table-column>
            <el-table-column label="评论时间" align="center">
              <template #="{ row, $index }">
                {{ row.commentTime }}
              </template>
            </el-table-column>
            <el-table-column label="评论类型" align="center">
              <template #="{ row, $index }">
                {{ row.pid || row.originId ? "回复" : "评论" }}
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="100px">
              <template #="{ row, $index }">
                <el-popconfirm
                  :title="`你确定要删除${row.content}这条评论吗？`"
                  width="300px"
                  height="300px"
                  icon="Delete"
                  @confirm="handleDeleteComment(row)"
                >
                  <template #reference>
                    <el-button type="danger" icon="Delete"></el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- <div v-else-if="scene == 1">
          <el-form :inline="true">
            <el-form-item label="属性名称" v-if="AttrForm">
              <el-input v-model="attrParams.attrName"></el-input>
            </el-form-item>
          </el-form>
          <el-button
            type="primary"
            icon="Plus"
            style="margin-bottom: 10px"
            :disabled="!attrParams.attrName"
            @click="addAttra"
            >添加属性值</el-button
          >
          <el-button
            type="danger"
            icon="Close"
            style="margin-bottom: 10px"
            :disabled="false"
            @click="addAttrValueCancel"
            v-if="AttrForm"
            >取消</el-button
          >
          <el-table
            style="margin: 20px 0"
            :border="true"
            :data="attrParams.attrValueList"
          >
            <el-table-column
              label="序号"
              align="center"
              type="index"
              width="300px"
            ></el-table-column>
            <el-table-column label="属性值名称" align="center" prop="valueName">
              <template #="{ row, $index }">
                <el-input
                  :ref="(vc: any) => { inputArr[$index] = vc }"
                  placeholder="请输入对应属性的属性值名称"
                  v-model="row.valueName"
                  v-if="row.flag"
                  @blur="handleInputBlur(row, $index)"
                  autofocus
                ></el-input>
                <div v-else @click="toEdit(row, $index)">
                  {{ row.valueName }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="300px">
              <template #="{ row, $index }">
                <el-button
                  type="danger"
                  icon="Delete"
                  @click="deleteAttr(row, $index)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button
            type="primary"
            icon="Plus"
            style="margin-bottom: 10px"
            :disabled="attrParams.attrValueList.length > 0 ? false : true"
            @click="saveAttr"
            >保存</el-button
          >
          <el-button
            type="danger"
            icon="Close"
            style="margin-bottom: 10px"
            :disabled="false"
            @click="addAttrCancel"
            >取消</el-button
          >
        </div> -->
      </el-card>
      <div class="demo-pagination-block" style="margin-top: 10px">
        <el-pagination
          v-model:current-page="pageNum"
          v-model:page-size="pageLimit"
          :page-sizes="[2, 4, 6, 8]"
          :background="true"
          layout=" , prev, pager, next, jumper,->,sizes,total,"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="hangdleSizeChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeUnmount, onMounted } from "vue";
import {
  reqCommentDel,
  reqCommentPage,
  reqDelCommentPile,
} from "@/api/product/attr/index";
import { ElMessage } from "element-plus";
import useCategoryStroe from "@/store/modules/category";
import { startLoading } from "@/util/Loading";
import { endLoading } from "@/util/Loading";
//分页器变量
const pageNum = ref<number>(1);
const pageLimit = ref<number>(6);
const total = ref<number>(0);
//定义数组，收集comment关键字
const searchKey = ref("");
// 获取table实例 加载loading
const mytable = ref();
// 收集批量删除id
const selectIdArr = ref([]);
//收集新增属性
let commentForm = ref({
  id: undefined,
  pid: null,
  userId: undefined,
  postId: 6,
  content: "",
  originId: undefined,
  username: "",
  avatarUrl: "",
  children: [],
  pname: null,
  puserId: null,
});
// 对应文章的评论
let comments = ref([]);
//定义卡片内容展示变量
onMounted(() => {
  getCommentList();
});

const getCommentList = async (search: string) => {
  startLoading(mytable.value.$el);
  if (search !== undefined) {
    let res = await reqCommentPage(pageNum.value, pageLimit.value, search);
    if (res.code == 200) {
      comments.value = res.data.records;
      total.value = res.data.total;
      endLoading();
    }
  } else {
    let res = await reqCommentPage(pageNum.value, pageLimit.value);
    if (res.code == 200) {
      comments.value = res.data.records;
      total.value = res.data.total;
      endLoading();
    }
  }
};
// 搜索评论
const handleSearch = () => {
  getCommentList(searchKey.value);
};
const handleCurrentChange = async () => {
  getCommentList();
};

const hangdleSizeChange = async () => {
  pageNum.value = 1;
  getCommentList();
};

//删除评论
const handleDeleteComment = async (row) => {
  console.log(row.id);

  let result = await reqCommentDel(row.id);
  if (result.code == 200) {
    ElMessage({
      type: "success",
      message: "删除成功",
    });
    getCommentList();
  } else {
    ElMessage({
      type: "error",
      message: "删除失败",
    });
  }
};
const reset = () => {
  getCommentList();
};
const selectChange = (value) => {
  selectIdArr.value = value;
};
const handlePileRemove = async () => {
  let idList = selectIdArr.value.map((item) => {
    return item.id;
  });
  let res = await reqDelCommentPile(idList);
  if (res.code == 200) {
    ElMessage({
      type: "success",
      message: "删除成功！",
    });
    getCommentList();
  } else {
    ElMessage({
      type: "error",
      message: "删除失败！",
    });
  }
};
</script>
<style scoped lang="scss">
.el-form-item:nth-child(1) {
}

.el-form-item:nth-child(2) {
  margin-right: 150px;
}
</style>
