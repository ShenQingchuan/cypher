/**
 * 通用JSON对象类型
 */
export type JSONValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JSONValue }
  | JSONValue[]

/**
 * 通用HTTP请求/响应体类型
 */
export type HttpBody = JSONValue | string | FormData | undefined

/**
 * 网络请求实体
 */
export interface NetworkRequest {
  timestampId: string
  url: string
  method: string
  duration: number
  requestHeaders: Record<string, string>
  responseHeaders: Record<string, string>
  requestBody: HttpBody
  status: number
  statusText: string
  responseBody: HttpBody
  error?: string
  encoding?: string // 响应的编码方式
}

/**
 * 过滤条件
 */
export interface FilterOptions {
  searchText?: string
  timeStart?: number
  timeEnd?: number
  statusCode?: number | string
  method?: string
  onlyErrors?: boolean
  requestHeaderSearch?: string
  requestBodySearch?: string
  responseHeaderSearch?: string
  responseBodySearch?: string
}

/**
 * 支持的HTTP方法
 */
export type HttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'PATCH'
  | 'HEAD'
  | 'OPTIONS'
  | 'CONNECT'
  | 'TRACE'
  | string // 支持自定义方法

/**
 * 消息动作类型
 */
export enum MessageAction {
  DevtoolsOpened = 'devtoolsOpened',
  DevtoolsClosed = 'devtoolsClosed',
  NewCypherRecord = 'newCypherRecord',
  NewRequest = 'newRequest',
}
