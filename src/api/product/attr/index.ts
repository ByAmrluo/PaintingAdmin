//书写关于属性管理相关API
import request from '@/util/request.ts'
import type { CategoryLevelOneData, AttrResData, AttrData } from '@/api/product/attr/type'
import { number } from 'echarts'
enum API {
    CATEGORYONE_URL = '/admin/product/getCategory1',//获取一级分类的接口
    CATEGORYTWO_URL = '/admin/product/getCategory2/',//获取二级分类的接口
    CATEGORYTHREE_URL = '/admin/product/getCategory3/',//获取三级分类的接口
    CATEGORYLIST_URL = `/admin/product/attrInfoList/`,//获取属性列表
    ADDORUPDATEATTR_URL = '/admin/product/saveAttrInfo',
    DELETEATTR_URL = '/admin/product/deleteAttr/',

    // 后台
    GETALLPAGE_URL = '/reserve/allPage',
    ADDCOMMENT = '/comment/add',
    GETCOMMENTLIST = '/comment/tree/',
    DELETECOMMENT = '/comment/delete/',
    GETCOMMENTPAGE = '/comment/selectByPage',
    DELEDEPILECOMMENT_URL = '/comment/delete/batch/'

}
export const reqCategoryOne = () => { return request.get<any, CategoryLevelOneData>(API.CATEGORYONE_URL) }
export const reqCategoryTwo = (category1Id: number) => { return request.get<any, CategoryLevelOneData>(API.CATEGORYTWO_URL + `${category1Id}`) }
export const reqCategoryThree = (category2Id: number) => { return request.get<any, CategoryLevelOneData>(API.CATEGORYTHREE_URL + `${category2Id}`) }
export const reqCategoryList = (category1Id: number, category2Id: number, category3Id: number) => { return request.get<any, AttrResData>(API.CATEGORYLIST_URL + `${category1Id}/` + `${category2Id}/` + `${category3Id}`) }

//新增或修改已有的属性接口
export const reqAddorUpdateAttr = (data: AttrData) => { return request.post<any, any>(API.ADDORUPDATEATTR_URL, data) }
//删除属性
export const reqDelAttr = (attrId: number) => { return request.delete<any, any>(API.DELETEATTR_URL + attrId) }



// 新增评论
export const reqAddComment = (commentForm: any) => { return request.post(API.ADDCOMMENT, commentForm) }
// 获取对应文章的评论
export const reqAllComment = (articleId: number) => { return request.get(API.GETCOMMENTLIST + articleId) }
// 删除评论
export const reqCommentDel = (deleteId: number) => { return request.delete(API.DELETECOMMENT + deleteId) }
// 评论分页构造器
export const reqCommentPage = (pageNum: number, pageSize: number, search: string) => {
    if (search) {
        return request.get(API.GETCOMMENTPAGE + '?' + `pageNum=${pageNum}&pageSize=${pageSize}&` + `content=${search}`)
    } else {
        return request.get(API.GETCOMMENTPAGE + '?' + `pageNum=${pageNum}&pageSize=${pageSize}`)
    }
}
// 批量删除评论
export const reqDelCommentPile = (CommentIds: number[]) => { return request.delete(API.DELEDEPILECOMMENT_URL + CommentIds) }
// 获取所有的订单（后台）
export const reqOrderPage = (pageNum: number, pageSize: number, search: string) => {
    if (search) {
        return request.get(API.GETALLPAGE_URL + '?' + `pageNum=${pageNum}&pageSize=${pageSize}&` + `title=${search}`)
    } else {
        return request.get(API.GETALLPAGE_URL + '?' + `pageNum=${pageNum}&pageSize=${pageSize}`)
    }
}