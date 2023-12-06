<template>
  <el-form v-model="spuParams">
    <el-form-item label="Spu名称">
      <el-input
        placeholder="请你输入Spu名称"
        v-model="spuParams.spuName"
      ></el-input>
    </el-form-item>
    <el-form-item label="Spu品牌">
      <el-select v-model="spuParams.tmId">
        <el-option
          v-for="item in AllBrand"
          :label="item.tmName"
          :key="item.id"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="Spu描述">
      <el-input type="textarea" v-model="spuParams.description"></el-input>
    </el-form-item>
    <el-form-item label="Spu图标">
      <!-- v-model:file-list 照片墙绑定的数据 -->
      <template #="{ row, $index }">
        <el-upload
          v-model:file-list="imagaeList"
          action="/api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove(row, $index)"
          :before-upload="handleBeforeUpload"
        >
          <el-icon>
            <Plus />
          </el-icon>
        </el-upload>
        <el-dialog v-model="dialogVisible" style="text-align: center">
          <img w-full :src="dialogImageUrl" style="width: 80%" />
        </el-dialog>
      </template>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-select
        style="margin-right: 10px"
        :placeholder="`还有${remainSaleAttr.length}个未选择`"
        v-model="AttrNameAndId"
      >
        <el-option
          v-for="item in remainSaleAttr"
          :label="item.name"
          :key="item.id"
          :value="`${item.id}:${item.name}`"
        ></el-option>
      </el-select>
      <el-button
        type="primary"
        icon="Plus"
        :disabled="AttrNameAndId ? false : true"
        @click="addAttrValue"
        >添加属性值</el-button
      >
      <el-table :border="true" style="margin: 10px 0px" :data="hasSaleAttr">
        <el-table-column
          label="序号"
          type="index"
          align="center"
        ></el-table-column>
        <el-table-column label="销售属性名称" align="center">
          <template #="{ row, $index }">
            {{ row.saleAttrName }}
          </template>
        </el-table-column>
        <el-table-column label="销售属性值">
          <template #="{ row, $index }">
            <el-tag
              v-for="(tag, index) in row.spuSaleAttrValueList"
              :key="tag.id"
              class="mx-1"
              closable
              :type="tag.type"
              style="margin-right: 5px"
              @close="row.spuSaleAttrValueList.splice(index, 1)"
            >
              {{ tag.saleAttrValueName }}
            </el-tag>
            <el-input
              placeholder="请你输入属性值"
              style="width: 120px; margin-right: 5px"
              v-if="row.flag == true"
              @blur="toLook(row, $index)"
              v-model="row.saleAttrValueName"
              autofocus
            ></el-input>
            <el-button
              v-else
              type="primary"
              size="small"
              icon="Plus"
              style="margin-right: 5px"
              @click="toEdit(row, $index)"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #="{ row, $index }">
            <el-button
              type="danger"
              size="small"
              icon="Delete"
              @click="hasSaleAttr.splice($index, 1)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="handleSave">保存</el-button>
      <el-button type="primary" @click="handleSceneCanel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import type { SpuRecordData, SpuData } from "@/api/product/spu/type.ts";
import {
  reqAllBrandList,
  reqImageList,
  reqSpuSaleList,
  reqAllSaleAttr,
  reqAddOrUpdateSpu,
} from "@/api/product/spu/index.ts";
import { ref, computed } from "vue";
import { ElMessage } from "element-plus";
import useCategoryStroe from "@/store/modules/category";
const CategoryStore = useCategoryStroe();
const emit = defineEmits(["changeScene"]);
const handleSceneCanel = () => {
  emit("changeScene", {
    num: 0,
    params: spuParams.value.id ? "update" : "add",
  });
};

//控制dialog dialogVisible
let dialogVisible = ref(false);
let dialogImageUrl = ref("");
//存储所有spu数据
let AllBrand = ref([]);
let imagaeList = ref([]);
let hasSaleAttr = ref([]);
let allSaleAttr = ref([]);
//收集还未选择的销售属性
let AttrNameAndId = ref("");

//村粗已有的spu对象
let spuParams = ref({
  category3Id: "",
  description: "",
  tmId: "",
  spuName: "",
  spuImageList: [],
  spuSaleAttrList: [],
});
const initHasSpuData = async (row: any) => {
  //row 为父组件传递的spu数据
  spuParams.value = row;
  //获取全部品牌数据
  let result = await reqAllBrandList();

  //获取对应spu照片墙数据
  let result1 = await reqImageList(row.id);

  //获取spu已有销售属性
  let result2 = await reqSpuSaleList(row.id);

  //获取全部spu销售属性
  let result3 = await reqAllSaleAttr();

  //存储全部品牌数据
  console.log(spuParams.value);

  AllBrand.value = result.data;
  imagaeList.value = result1.data;
  console.log(imagaeList.value);

  imagaeList.value = result1.data.map((item) => {
    return {
      name: item.imgName,
      url: item.imgUrl,
    };
  });
  hasSaleAttr.value = result2.data;
  allSaleAttr.value = result3.data;
  console.log(hasSaleAttr.value);
  console.log(allSaleAttr.value);
};
const initAddSpuData = async (row: any) => {
  //row 为父组件传递的spu数据
  //获取全部品牌数组
  let result = await reqAllBrandList();
  //获取全部spu销售属性
  let result3 = await reqAllSaleAttr();
  //存储全部品牌数据
  spuParams.value.category3Id = CategoryStore.categoryThreeId;
  AllBrand.value = result.data;
  allSaleAttr.value = result3.data;
};
//添加属性值
const addAttrValue = () => {
  const [baseSaleAttrId, saleAttrName] = AttrNameAndId.value.split(":");
  hasSaleAttr.value.push({
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: [],
  });
  AttrNameAndId.value = "";
};
//处理图片放大
const handlePictureCardPreview = (file) => {
  dialogVisible.value = true;
  console.log(file);
  dialogImageUrl = file.url;
};
//处理删除图片
const handleRemove = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles);
};
//上传图片前约束上传图片的大小与格式
const handleBeforeUpload = (file) => {
  if (
    file.type == "image/png" ||
    file.type == "image/jpg" ||
    file.type == "image/gif" ||
    file.type == "image/jpeg"
  ) {
    if (file.size >= 1024 * 1024 * 3) {
      ElMessage({
        type: "error",
        message: "上传的图片大小不能超过3MB!",
      });
      return false;
    }
    return true;
  } else {
    ElMessage({
      type: "error",
      message: "上传的类型只能是JPG/PNG/GIF/JPEG!",
    });
    return false;
  }
};

const resetData = () => {
  AllBrand.value = [];
  imagaeList.value = [];
  hasSaleAttr.value = [];
  allSaleAttr.value = [];
  spuParams.value = {
    category3Id: "",
    description: "",
    tmId: "",
    spuName: "",
    spuImageList: [],
    spuSaleAttrList: [],
  };
};
const remainSaleAttr = computed(() => {
  //筛选出已有的销售属性，
  let unSelectArr = allSaleAttr.value.filter((item) => {
    return hasSaleAttr.value.every((item1) => {
      return item1.saleAttrName != item.name;
    });
  });
  return unSelectArr;
});
const toEdit = (row, index) => {
  row.flag = true;
  row.saleAttrValue = "";
};

const toLook = (row, index) => {
  //整理服务器需要的属性值形式
  let newSaleAttrValue = {
    baseSaleAttrId: row.baseSaleAttrId,
    saleAttrValueName: row.saleAttrValueName,
  };
  if (newSaleAttrValue.saleAttrValueName.trim() == "") {
    ElMessage({
      type: "error",
      message: "属性值不能为空",
    });
    row.flag = false;
    return;
  }
  let repeat = row.spuSaleAttrValueList.find((item) => {
    return item.saleAttrValueName == newSaleAttrValue.saleAttrValueName;
  });
  if (repeat) {
    ElMessage({
      type: "error",
      message: "属性值不重复",
    });
    return;
    return;
  }
  //追加新的属性值对象
  row.spuSaleAttrValueList.push(newSaleAttrValue);
  row.flag = false;
  console.log(row.spuSaleAttrValueList);
};
//点击保存后向服务器发送请求更新数据
const handleSave = async () => {
  //整理数据 发送请求
  //照片墙
  imagaeList.value = imagaeList.value.map((item) => {
    console.log(item.response);
    return {
      imgName: item.name,
      imgUrl: (item.response && item.response.data) || item.url,
    };
  });

  spuParams.value.spuImageList = imagaeList.value;
  spuParams.value.spuSaleAttrList = hasSaleAttr.value;
  let res = await reqAddOrUpdateSpu(spuParams.value);
  if (res.code == 200) {
    ElMessage({
      type: "success",
      message: spuParams.value.id ? "更新成功" : "添加成功",
    });
    emit("changeScene", {
      num: 0,
      params: spuParams.value.id ? "update" : "add",
    });
  }
};
defineExpose({ initHasSpuData, resetData, initAddSpuData });
</script>

<style lang="sass" scoped></style>
