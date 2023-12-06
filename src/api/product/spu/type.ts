//书写类型

//定义服务器返回数据的共有类型
export interface ResponseData {
    code: number,
    message: string,
    ok: boolean,
}
export interface SpuData {
    id: number,
    spuName: string,
    description: string,
    category3Id: number | string,
    tmId: number,
    spuSaleAttrList?: null //存储销售属性
    spuImageList?: null //照片墙数据
}
export interface SpuRecordData extends ResponseData {
    data: {
        records: SpuData[]
        total: number,
        size: number,
        current: number,
        searchCount: boolean,
        pages: number
    }
}




