export interface ApiResponse<T> {
    timestamp: number
    status: number
    message: string
    data: T
}

export interface ErrorResponse {
    timestamp: number
    status: number
    error: string
    message: string
    path: string
    errors?: ValidationError[]
}

export interface ValidationError {
    field: string
    message: string
}

export interface PageResponse<T> {
    content: T[]
    page: number
    size: number
    totalElements: number
    totalPages: number
    first: boolean
    last: boolean
}

export interface CursorResponse<T> {
    content: T[]
    nextCursor: string | null
    hasNext: boolean
}