export interface ProductSearchRequest {
    productId?: number
    name?: string
    subtitle?: string
    code?: string
    description?: string
    position?: number
    status?: number
    categoryId?: number
    reviewCount?: number
    naverPartner?: boolean
    naverPartnerTitle?: string
    pg?: boolean
    pgSellingPrice?: number
    naverAttribute?: string
    naverPartnerTitlePg?: string
    reviewCountPg?: number
    isRemoved?: boolean
}