//定义品牌管理模块的接口
import { ResponseData } from "@/api/user/type";

//已有品牌的数据类型
export interface Brand extends ResponseData {
    id?: number,
    tnName: string,
    logoUrl: string,
}

export interface reqBrand {
    id?: number,
    tmName: string,
    logoUrl: string,
}
//包含全部品牌数据的ts类型
export type Records = Brand[]
//获取已有品牌的数据的ts类型
export interface BrandResData extends Brand {
    data: {
        records: Records,
        total: number,
        size: number,
        current: number,
        orders: any[],
        optimizeCountSql: boolean,
        hitCount: boolean,
        countId?: null,
        maxLimi?: null,
        searchCoun: boolean,
        pages: number
    },
}