<template>
  <!-- 内容区域 -->
  <div>
    <el-card class="box-card" style="margin: 20px 0">
      <el-form :inline="true">
        <el-form-item label="用户名">
          <el-input
            placeholder="请输入需要作品标题"
            v-model="searchKey"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="handleSearch"
            title="搜索"
            :disabled="searchKey == '' ? true : false"
            >搜索</el-button
          >
          <el-button type="danger" @click="reset" title="重置">重置</el-button>
          <el-popconfirm
            :title="`你确定要删除这些作品吗？`"
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

      <!-- //引入table组件 -->
      <!-- data：表格要展示的数据，必须是数组 -->
      <el-table
        style="width: 100%"
        :border="true"
        :data="res"
        ref="mytable"
        @selection-change="selectChange"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column
          label="序号"
          width="180px"
          align="center"
          type="index"
        />
        <!-- prop：显示列要展示的内容，值与el-table绑定的数组内的字段名有关 -->
        <el-table-column
          label="作品标题"
          align="center"
          show-overflow-tooltip="true"
        >
          <template #="{ row, $index }">
            {{ row.title }}
          </template>
        </el-table-column>
        <el-table-column
          label="作品内容"
          align="center"
          min-width="90"
          show-overflow-tooltip="true"
        >
          <template #="{ row, $index }">
            {{ row.content }}
          </template>
        </el-table-column>
        <!-- row代表品牌对象 数组中的每一项 -->
        <el-table-column label="作品封面" align="center">
          <template #="{ row, $index }">
            <img
              :src="row.img"
              alt=""
              style="
                width: 80px;
                height: 65px;
                border-radius: 8px;
                border: 1px solid #fab6b6;
                box-shadow: var(--el-box-shadow-lighter);
              "
            />
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="200px">
          <template #="{ row, $index }">
            <el-button
              type="primary"
              icon="View"
              circle
              title="预览"
              @click="handlePreview(row, $index)"
            />
            <el-popconfirm
              title="你确定要删除这条信息吗？"
              width="300px"
              height="300px"
              icon="Delete"
              @confirm="removeArticleItem(row, $index)"
            >
              <template #reference>
                <el-button type="danger" icon="Delete" circle title="删除" />
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器组件
             v-model:current-page 设置当前页码
              v-model:page-size 每页显示数据的个数
              :page-sizes 每页显示个数选择器的选项设置（下拉菜单的数据）
              ：small 是否使用小型分页器样式
              :background 按钮是否有背景颜色
              layout 设置分页器子组件的布局 ->将箭头右边的子组件顶过去
              disabled 是否禁用组件
              current-change ：当前页码发生变化的事件
             size-change:当页面page-size发生改变的时候触发
            -->
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
    <!-- 对话框组件 -->

    <!-- 
        v-model 控制对话框显示与隐藏
:before-close="handleClose"关闭dialog的回调函数s
     -->
    <el-dialog v-model="dialogVisible" title="预览作品" width="50%">
      <div class="big">
        <div class="detail-contaier">
          <div class="header">
            <h1>{{ articleParams.title }}</h1>
            <div class="userInfo">
              <div class="avatar">
                <img
                  :src="articleParams.avatarUrl"
                  alt=""
                  style="width: 50px; height: 50px"
                />

                <div class="user">
                  <h4>{{ articleParams.username }}</h4>
                  <p><span>湖南&nbsp;</span><span>设计师&nbsp;</span></p>
                </div>
              </div>
              <div class="operate">
                <button class="email" :disabled="true">收藏</button>
                <button class="consider" :disabled="true">关注</button>
              </div>
            </div>
          </div>
          <div class="content">
            <div class="contentText">
              <p>{{ articleParams.content }}</p>
            </div>
            <div
              class="imgbox"
              v-for="item in articleParams.filesList"
              :key="item.id"
            >
              <img :src="item.url ? item.url : item" alt="" />
              <p v-if="articleParams.direction">雪山</p>
            </div>
          </div>
          <div class="footer">
            <div class="comment-opera">
              <div class="thumb">
                <svg
                  t="1697530681602"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="2403"
                  width="50"
                  height="50"
                  :aria-disabled="true"
                >
                  <path
                    d="M729.6 896H426.666667c-38.4 0-72.533333-12.8-102.4-34.133333-17.066667 21.333333-38.4 34.133333-68.266667 34.133333H170.666667c-46.933333 0-85.333333-38.4-85.333334-85.333333v-298.666667c0-46.933333 38.4-85.333333 85.333334-85.333333h128c72.533333 0 128-55.466667 128-128V256c0-72.533333 55.466667-128 128-128s128 55.466667 128 128v170.666667h85.333333c72.533333 0 128 55.466667 128 128v8.533333l-42.666667 213.333333c-17.066667 72.533333-68.266667 119.466667-123.733333 119.466667zM341.333333 725.333333c0 46.933333 38.4 85.333333 85.333334 85.333334h298.666666c17.066667 0 34.133333-17.066667 42.666667-51.2l42.666667-209.066667c0-21.333333-21.333333-38.4-42.666667-38.4h-128c-25.6 0-42.666667-17.066667-42.666667-42.666667V256c0-25.6-17.066667-42.666667-42.666666-42.666667s-42.666667 17.066667-42.666667 42.666667v42.666667c0 102.4-72.533333 187.733333-170.666667 209.066666V725.333333z m-170.666666-213.333333v298.666667h85.333333v-298.666667H170.666667z"
                    p-id="2404"
                  ></path>
                </svg>
                <h4>{{ articleParams.hits }}</h4>
              </div>
            </div>

            <div class="tag">
              <div><a href="#">原创</a></div>
              <div><a href="#">平面设计</a></div>
              <div><a href="#">简洁</a></div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogCancel">退出</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from "vue";
import { reqArticlePage, reqDelArt, reqArticleImgs } from "@/api/product/brand";
import type { Records, BrandResData, reqBrand } from "@/api/product/brand/type";
import type { UploadProps } from "element-plus";
import { ElMessage } from "element-plus";
import { startLoading } from "@/util/Loading";
import { endLoading } from "@/util/Loading";
//分页器变量
const pageNum = ref<number>(1);
const pageLimit = ref<number>(6);
const total = ref<number>(0);
const searchKey = ref("");
//品牌数据
const res = ref<Records>([]);
let articleParams = ref<any>({});
const mytable = ref();
const selectIdArr = ref([]);
//dialog对话框
const dialogVisible = ref<boolean>(false);
//获取品牌表单实例

//是否开启已上传图片预览
const showList = ref(true);
//获取品牌接口封装成一个函数：在任何情况获取数据，调用此函数即可
onMounted(() => {
  getHasArticle();
});
const getHasArticle = async (searchKey) => {
  startLoading(mytable.value.$el);
  if (searchKey !== undefined) {
    let result: any = await reqArticlePage(
      pageNum.value,
      pageLimit.value,
      searchKey
    );
    if (result.code == 200) {
      // 获取总条目
      total.value = result.data.total;
      res.value = result.data.records;
      console.log(res.value);

      endLoading();
    } else {
      ElMessage({
        type: "error",
        message: "没有数据！",
      });
    }
  } else {
    let result: any = await reqArticlePage(pageNum.value, pageLimit.value);
    if (result.code == 200) {
      // 获取总条目
      total.value = result.data.total;
      res.value = result.data.records;
      console.log(res.value);

      endLoading();
    } else {
      ElMessage({
        type: "error",
        message: "没有数据！",
      });
    }
  }
};
//搜索
const handleSearch = () => {
  getHasArticle(searchKey.value);
};
// 重置
const reset = () => {
  searchKey.value = "";
  getHasArticle();
};
//当前页码发生变化的时候，再次调用接口发送请求
//当自定义页码事件触发的时候，会向父组件传递当前页码
const handleCurrentChange = async () => {
  getHasArticle();
};

const hangdleSizeChange = async () => {
  pageNum.value = 1;
  getHasArticle();
};

const handlePreview = async (row) => {
  articleParams.value = row;
  let res = await reqArticleImgs(row.id);
  if (res.code == 200) {
    articleParams.value.filesList = res.data.filesList;
  }
  dialogVisible.value = true;
  console.log(articleParams.value);
};
//删除作品按钮
const removeArticleItem = async (row: reqBrand) => {
  let result = await reqDelArt(row.id);
  if (result.code == 200) {
    pageNum.value = res.value.length > 1 ? pageNum.value : pageNum.value - 1;
    getHasArticle();
    ElMessage({
      type: "success",
      message: "删除" + result.message,
    });
  } else {
    ElMessage({
      type: "error",
      message: "删除" + result.message,
    });
  }
};
const selectChange = (value) => {
  selectIdArr.value = value;
};
//
//取消dialog
const dialogCancel = () => {
  // articleParams.id = undefined;
  // articleParams.tmName = "";
  // articleParams.logoUrl = "";
  // showList.value = false;
  dialogVisible.value = false;
};
const handlePileRemove = async () => {
  let idList = selectIdArr.value.map((item) => {
    return item.id;
  });
  let res = await reqDelArt(idList);
  if (res.code == 200) {
    ElMessage({
      type: "success",
      message: "删除成功！",
    });
    getHasArticle();
  } else {
    ElMessage({
      type: "error",
      message: "删除失败！",
    });
  }
};
</script>

<style lang="scss" scoped>
a {
  color: rgb(65, 65, 65);
  text-decoration: none;
}
.BrandForm {
  margin: 0 auto;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
}
.big {
  margin-top: 70px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  width: 90%;
  padding-bottom: 40px;
  .detail-contaier {
    overflow: hidden;

    width: 100%;
    flex-direction: column;
    margin: 0 auto;
    display: flex;
    justify-content: start;
    align-items: center;
    .header {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: start;
      h1 {
        font-size: 30px;
        font-weight: 500px;
        font-family: "PingFang SC", "Lantinghei SC", "Microsoft YaHei",
          "HanHei SC", "Helvetica Neue", "Open Sans", Arial, "Hiragino Sans GB",
          微软雅黑, STHeiti, "WenQuanYi Micro Hei", SimSun, sans-serif,
          HYWenHei-GEW !important;
      }
      .userInfo {
        width: 100%;
        display: flex;
        margin-top: 60px;
        flex-direction: row;
        justify-content: space-between;
        .avatar {
          display: flex;
          align-items: center;
          width: 20%;
          img {
            margin-right: 5px;
            width: 20%;
            border-radius: 50px;
          }
          .user {
            display: flex;
            flex-direction: column;
            height: 100%;
            justify-content: space-evenly;
            h4 {
              font-size: 14px;
              color: rgb(51, 51, 51);
              &:hover {
                cursor: pointer;
                color: orange;
              }
            }
            p {
              font-size: 12px;
              color: rgb(136, 136, 136);
            }
          }
        }
        .operate {
          width: 40%;
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          align-items: center;
          justify-content: flex-end;
          .email {
            width: 20%;
            height: 40px;
            font-size: 14px;
            border: 1px solid rgb(30, 27, 27);
            background-color: #fff;
            border-radius: 10px;
            &:hover {
              border: none;
              background-color: rgba(153, 153, 153, 0.3);
            }
          }
          .consider {
            width: 20%;
            height: 40px;
            border: none;
            border-radius: 10px;
            margin-left: 10px;
            font-size: 14px;
            background-color: yellow;
            &:hover {
              background-color: orange;
            }
          }
        }
      }
    }
    .content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: 40px;
      padding-bottom: 40px;
      width: 100%;
      .contentText {
        width: 100%;
        display: flex;
        white-space: pre-line;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 40px;
      }
      .imgbox {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        margin-bottom: 20px;
        img {
          width: 100%;
          object-fit: cover;
        }
      }
    }
    .footer {
      margin-top: 40px;
      position: relative;
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      align-items: center;
      justify-content: center;
      .comment-opera {
        display: flex;
        width: 100%;
        position: relative;
        align-items: center;
        justify-content: center;

        .thumb {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          width: 150px;
          height: 90px;
          background-color: yellow;
          border-radius: 90px;
          justify-content: center;
          &:hover {
            background-color: orange;
            cursor: grab;
          }
          h4 {
            margin-top: 5px;
          }
        }
        .opera {
          display: flex;
          width: 40%;
          height: 40px;
          position: absolute;
          right: 0;
          flex-wrap: nowrap;

          .collect {
            position: absolute;
            right: 0;
            box-sizing: border-box;
            width: 20%;
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            align-items: center;
            height: 40px;
            font-size: 16px;
            border: 1px solid rgb(30, 27, 27);
            background-color: #fff;
            border-radius: 10px;
            &:hover {
              box-sizing: border-box;
              border: none;
              background-color: rgba(153, 153, 153, 0.3);
            }
          }
        }
      }

      .tag {
        margin-top: 20px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        a {
          display: block;
          padding: 10px 20px;
          background-color: rgba(153, 153, 153, 0.1);
          margin-right: 10px;
          border-radius: 20px;
        }
      }
    }
    .comment {
      width: 100%;
    }
  }
}
</style>
<style>
.avatar-uploader .el-upload {
  display: flex;
  width: 100px;
  height: 100px;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;

  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
