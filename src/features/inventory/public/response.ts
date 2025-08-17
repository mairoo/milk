export enum ProductStatus {
    ENABLED = 0,
    DISABLED = 1
}

export enum ProductStock {
    SOLD_OUT = 0,
    IN_STOCK = 1
}

export interface CategoryResponse {
    id: number
    created: string
    modified: string
    title: string
    slug: string
    thumbnail: string
    description: string
    description1: string
    level: number
    parentId: number
    discountRate: number
    pg: boolean
    pgDiscountRate: number
}

export interface ProductResponse {
    id: number
    created: string | null
    modified: string | null
    isRemoved: boolean
    name: string
    subtitle: string | null
    code: string
    listPrice: number
    sellingPrice: number
    description: string | null
    position: number
    status: ProductStatus
    stock: ProductStock
    categoryId: number
    reviewCount: number
    naverPartner: boolean
    naverPartnerTitle: string | null
    naverAttribute: string | null
    naverPartnerTitlePg: string | null
    pg: boolean
    pgSellingPrice: number
    reviewCountPg: number
}