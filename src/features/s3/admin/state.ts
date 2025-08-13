import {HealthCheckResponse} from "@/features/s3/admin/response";

export interface HealthCheckState {
    loading: boolean
    data: HealthCheckResponse | null
    error: string | null
    lastChecked: string | null
}