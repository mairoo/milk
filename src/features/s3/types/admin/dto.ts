export interface HealthCheckResponse {
    status: string
    healthy: boolean
    timestamp: string
    service: string
    checks?: string[]
}

export interface HealthCheckError {
    message: string
    timestamp: string
    details?: string[]
}