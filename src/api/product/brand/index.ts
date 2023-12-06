//导入axios接口
import request from "@/util/request";
import type { BrandResData, reqBrand } from './type.ts'
//品牌管理接口地址
enum API {
    PAGELIST_URL = '/article/page',
    DELETEART_URL = '/article/',
    GETARTICLEIMGS_URL = '/article/articleImgs/',
    // 


    BRAND_URL = '/admin/product/baseTrademark/',
    ADDBRAND_URL = '/admin/product/baseTrademark/save',
    UPDATEBRAND_URL = '/admin/product/baseTrademark/update',
    REMOVEBRAND_URL = '/admin/product/baseTrademark/remove/'
}


// 分页获取文章
export const reqArticlePage = (pageNum: number, pageSize: number, search: string) => {

    if (search) {
        return request.get(API.PAGELIST_URL + '?' + `pageNum=${pageNum}&pageSize=${pageSize}&` + `title=${search}`)
    } else {
        return request.get(API.PAGELIST_URL + '?' + `pageNum=${pageNum}&pageSize=${pageSize}`)
    }

}
// 删除文章
export const reqDelArt = (id) => { return request.delete(API.DELETEART_URL + id) }
// 获取文章图片信息
export const reqArticleImgs = (id: number) => { return request.get(API.GETARTICLEIMGS_URL + id) }