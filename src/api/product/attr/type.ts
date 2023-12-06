//分类相关数据ts类型
import type { ResponseData } from "@/api/user/type";

export interface CategoryLevelone {
    id: number | string,
    name: string,
    category1Id?: number
    category2Id?: number
}

export interface CategoryLevelOneData extends ResponseData {
    data: CategoryLevelone[]
}
//属性值类型定义
export interface AttrValue {
    id?: number | string,
    valueName: string,
    attrId?: number
    flag?: boolean,
}
export type AttrDataList = AttrValue[]
export interface AttrData {
    id?: number | string,
    attrName: string,
    categoryId: number | string,
    categoryLevel: number | string,
    attrValueList: AttrValue[]
}
export interface AttrResData extends ResponseData {
    data: AttrData[]
}