import request from '@/util/request.ts'
import { SpuRecordData } from './type.ts'
enum API {
    HASSPU_URL = '/admin/product/', //获取已有spu数组
    ALLBRAND_URL = '/admin/product/baseTrademark/getTrademarkList',
    IMAGE_URL = '/admin/product/spuImageList/',
    SPUSALE_URL = '/admin/product/spuSaleAttrList/',
    //获取整个项目全部的销售属性
    ALLSALEATTR = '/admin/product/baseSaleAttrList',
    //追加一个新的spu
    ADDSPU_URL = '/admin/product/saveSpuInfo',
    // 更新已有的Spu
    UPDATESPU_URL = '/admin/product/updateSpuInfo',
    //新增sku
    ADDSKU_URL = '/admin/product/saveSkuInfo',
    ALLSKU_URL = '/admin/product/findBySpuId/', //获取某个spu下的全部sku
    //删除某个已有spu
    DELETESPU_URL = '/admin/product/deleteSpu/'
}
//获取某个三级分类下已有spu的数组
export const reqHasSpuList = (page: number, limit: number, category3Id: string | number) => { return request.get<any, SpuRecordData>(API.HASSPU_URL + `${page}` + `/${limit}` + `?category3Id=${category3Id}`) }
export const reqAllBrandList = () => { return request.get<any, any>(API.ALLBRAND_URL) }
//获取某个已有spu下所有照片
export const reqImageList = (spuId: number) => { return request.get<any, any>(API.IMAGE_URL + spuId) }
//获取某个已有spu销售属性
export const reqSpuSaleList = (spuId: number) => { return request.get<any, any>(API.SPUSALE_URL + spuId) }
//获取某个sku下的所有销售属性
export const reqAllSaleAttr = () => { return request.get<any, any>(API.ALLSALEATTR) }
//追加新的Spu
export const reqAddOrUpdateSpu = (data: any) => {
    if (data.id) {
        return request.post<any, any>(API.UPDATESPU_URL, data)
    } else {
        return request.post<any, any>(API.ADDSPU_URL, data)
    }
}
//追加新的Sku
export const reqAddSku = (data: any) => { return request.post<any, any>(API.ADDSKU_URL, data) }
//获取某个spu下的全部sku
export const reqAllSku = (spuId: number | string) => { return request.get<any, any>(API.ALLSKU_URL + spuId) }
//删除某个已有的SPU
export const reqDelSpu = (spuId: number | string) => { return request.delete(API.DELETESPU_URL + spuId) }