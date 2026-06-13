export type ChatbotSetting = {
    key: string,
    value: string
}

export type Pagination = {
    totalItems: number,
    totalPages : number,
    currentPage: number,
    perPage: number,
    hasNextPage: boolean,
    hasPrevPage: boolean
}

export const SETTINGS_USERNAME_KEY = "settings:auth:username"
export const SETTINGS_PASSWORD_KEY = "settings:auth:password"
export const SETTINGS_TRANSCRIPT_RECEIVERS_KEY = "settings:transcript-recievers"
export const SETTINGS_MAIL_HOST = "settings:mail:host"
export const SETTINGS_MAIL_USER = "settings:mail:user"
export const SETTINGS_MAIL_PASSWORD = "settings:mail:password"

export const REDIS_PREFIX = 'calcoast:'
