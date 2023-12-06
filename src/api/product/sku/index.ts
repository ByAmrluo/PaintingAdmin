import request from "@/util/request";
enum API {
    GETPAGESKU_URL = '/admin/product/list/', //获取已有的sku数据
    CANCELSALE_URL = '/admin/product/cancelSale/',//下架sku
    ONSALE_ULR = '/admin/product/onSale/',
    SKUINFO_URL = '/admin/product/getSkuInfo/',
    DELETESKU_URL = '/admin/product/deleteSku/'

}
export const reqSkuList = (page: number, limit: number) => { return request.get(API.GETPAGESKU_URL + `${page}/` + `${limit}`) }
export const reqCancelSale = (skuId: number) => { return request.get(API.CANCELSALE_URL + skuId) }
export const reqOnSale = (skuId: number) => { return request.get(API.ONSALE_ULR + skuId) }
export const reqSkuInfo = (skuId: number) => { return request.get(API.SKUINFO_URL + skuId) }
//删除已有sku
export const reqDelSku = (skuId: number) => { return request.delete(API.DELETESKU_URL + skuId) }