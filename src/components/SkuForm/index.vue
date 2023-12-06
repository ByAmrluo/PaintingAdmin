<template>
    <el-form label-width="120px" v-model="skuParams">
        <el-form-item label="SKU名称">
            <el-input placeholder="请输入SKU名称" v-model="skuParams.skuName"></el-input>
        </el-form-item>
        <el-form-item label="价格(元)">
            <el-input placeholder="请输入价格" type="number" v-model="skuParams.price"></el-input>
        </el-form-item>
        <el-form-item label="重量(g)">
            <el-input placeholder="请输入重量" type="number" v-model="skuParams.weight"></el-input>
        </el-form-item>
        <el-form-item label="SKU描述">
            <el-input placeholder="请输入SKU描述" type="textarea" v-model="skuParams.skuDesc"></el-input>
        </el-form-item>
        <el-form-item label="平台属性">
            <el-form :inline="true">
                <el-form-item v-for="(item) in attrArr" :key="item.id" :label="item.attrName">
                    <el-select v-model="item.attrIdAndValueId">
                        <el-option v-for="(attrValue, index) in item.attrValueList" :key="attrValue.id"
                            :label="attrValue.valueName" :value="`${item.id}:${attrValue.id}`"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-form-item>
        <el-form-item label="销售属性">
            <el-form :inline="true">
                <el-form-item v-for="item in saleArr" :key="item.id" :label="item.saleAttrName">
                    <el-select v-model="item.saleIdAndValueId">
                        <el-option v-for="saleAttrValue in item.spuSaleAttrValueList" :key="saleAttrValue.id"
                            :label="saleAttrValue.saleAttrValueName" :value="`${item.id}:${saleAttrValue.id}`"></el-option>

                    </el-select>
                </el-form-item>

            </el-form>
        </el-form-item>
        <el-form-item label="选择海报">
            <el-table :border="true" :data="imgArr" ref="table">
                <el-table-column type="selection" width="80px" align="center"></el-table-column>
                <el-table-column label="图片" align="center">
                    <template #="{ row, $index }">
                        <img :src="row.imgUrl" :alt="row.imgName" style="width:200px;height:150px;">
                    </template>
                </el-table-column>
                <el-table-column label="名称" align="center">
                    <template #="{ row, $index }">
                        <div>{{ row.imgName }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template #="{ row, $index }">
                        <el-button icon="Setting" type="primary" @click="handlerDefault(row, $index)">设为默认</el-button>
                    </template>

                </el-table-column>
            </el-table>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="handleSave">保存</el-button>
            <el-button type="primary" @click="handleSceneCanel">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script lang="ts" setup>
const emit = defineEmits(['changeScene'])
import { reqCategoryList } from '@/api/product/attr';
import { reqImageList, reqSpuSaleList, reqAddSku } from '@/api/product/spu/index'
import { ElMessage } from 'element-plus';
import { ref, reactive } from 'vue';

//平台属性
let attrArr = ref<any>([])
//销售属性
let saleArr = ref<any>([])
//获取table组件实例
const table = ref()
//照片墙
//添加sku收集的数据\
let skuParams = reactive({
    category3Id: 0,
    price: 0,
    spuId: 0,
    tmId: 0,
    skuName: "",
    weight: "",
    skuDesc: "",
    skuDefaultImg: "",
    skuAttrValueList: [
        {
            attrId: 0,
            valueId: 0,
        }
    ],
    skuSaleAttrValueList: [
        {

            saleAttrId: 0,
            saleAttrValueId: 0,

        }
    ],

})
let imgArr = ref<any>([])
//点击保存按钮发送请求
const handleSave = async () => {
    //整理参数
    skuParams.skuAttrValueList = attrArr.value.reduce((prev, next) => {
        if (next.attrIdAndValueId) {
            let [attrId, valueId] = next.attrIdAndValueId.split(':')
            prev.push({
                attrId,
                valueId
            })
        }
        return prev
    }, [])
    skuParams.skuSaleAttrValueList = saleArr.value.reduce((prev, next) => {
        if (next.saleIdAndValueId) {
            let [saleAttrId, saleAttrValueId] = next.saleIdAndValueId.split(':')
            prev.push({
                saleAttrId,
                saleAttrValueId
            })
        }
        return prev
    }, [])
    //添加sku请求
    let result = await reqAddSku(skuParams)
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '添加成功！'
        })
    } else {
        ElMessage({
            type: 'error',
            message: '添加失败！'
        })
    }
    emit('changeScene', { num: 0, params: '' })
}
const handleSceneCanel = () => {
    emit('changeScene', { num: 0, params: '' })
}
const initSkuData = async (c1: number, c2: number, sku: any) => {
    skuParams.category3Id = sku.category3Id
    skuParams.tmId = sku.tmId
    skuParams.spuId = sku.id
    console.log(sku);

    //获取平台属性
    let res = await reqCategoryList(c1, c2, sku.category3Id)
    //获取对应销售属性
    let res1 = await reqSpuSaleList(sku.id)
    //获取照片墙数据
    let res2 = await reqImageList(sku.id)
    attrArr.value = res.data
    saleArr.value = res1.data
    imgArr.value = res2.data
}
//设置默认图片回调
const handlerDefault = (row, index) => {
    //复选框选中
    table.value.clearSelection()
    table.value.toggleRowSelection(row, true)
    //收集默认图片地址
    skuParams.skuDefaultImg = row.imgUrl
}
defineExpose({ initSkuData })
</script>